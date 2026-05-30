const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const pool = require('../config/database');
const { validationResult } = require('express-validator');

/**
 * Helper function to log activity
 */
async function logActivity(userId, action, description, ipAddress) {
  try {
    await pool.query(
      'INSERT INTO activity_logs (user_id, action, description, ip_address) VALUES ($1, $2, $3, $4)',
      [userId, action, description, ipAddress]
    );
  } catch (error) {
    console.error('Log activity error:', error);
  }
}

class AuthController {
  /**
   * Register new user
   */
  async register(req, res) {
    try {
      // Validate input
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { email, password, full_name, department, phone } = req.body;

      // Check if user exists
      const existingUser = await pool.query(
        'SELECT id FROM users WHERE email = $1',
        [email.toLowerCase()]
      );

      if (existingUser.rows.length > 0) {
        return res.status(400).json({ error: 'Email already registered' });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create user
      const result = await pool.query(
        `INSERT INTO users (email, password, full_name, role, department, phone) 
         VALUES ($1, $2, $3, $4, $5, $6) 
         RETURNING id, email, full_name, role, department, created_at`,
        [email.toLowerCase(), hashedPassword, full_name, 'user', department, phone]
      );

      const user = result.rows[0];

      // Log activity
      await logActivity(user.id, 'USER_REGISTERED', 'New user registered', req.ip);

      res.status(201).json({
        success: true,
        message: 'User registered successfully',
        user: {
          id: user.id,
          email: user.email,
          full_name: user.full_name,
          role: user.role
        }
      });
    } catch (error) {
      console.error('Register error:', error);
      res.status(500).json({ error: 'Registration failed' });
    }
  }

  /**
   * Login user
   */
  async login(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { email, password } = req.body;

      // Get user
      const result = await pool.query(
        'SELECT * FROM users WHERE email = $1 AND is_active = true',
        [email.toLowerCase()]
      );

      if (result.rows.length === 0) {
        return res.status(401).json({ error: 'Invalid email or password' });
      }

      const user = result.rows[0];

      // Verify password
      const validPassword = await bcrypt.compare(password, user.password);
      if (!validPassword) {
        return res.status(401).json({ error: 'Invalid email or password' });
      }

      // Generate tokens
      const accessToken = jwt.sign(
        { userId: user.id, email: user.email, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
      );

      const refreshToken = jwt.sign(
        { userId: user.id },
        process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '30d' }
      );

      // Update last login
      await pool.query(
        'UPDATE users SET last_login = NOW() WHERE id = $1',
        [user.id]
      );

      // Log activity
      await logActivity(user.id, 'USER_LOGIN', 'User logged in', req.ip);

      res.json({
        success: true,
        message: 'Login successful',
        user: {
          id: user.id,
          email: user.email,
          full_name: user.full_name,
          role: user.role,
          department: user.department,
          avatar_url: user.avatar_url
        },
        tokens: {
          accessToken,
          refreshToken
        }
      });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ error: 'Login failed' });
    }
  }

  /**
   * Get current user profile
   */
  async getProfile(req, res) {
    try {
      const result = await pool.query(
        `SELECT id, email, full_name, role, department, phone, avatar_url, 
         created_at, last_login FROM users WHERE id = $1`,
        [req.user.id]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'User not found' });
      }

      res.json({ user: result.rows[0] });
    } catch (error) {
      console.error('Get profile error:', error);
      res.status(500).json({ error: 'Failed to get profile' });
    }
  }

  /**
   * Update user profile
   */
  async updateProfile(req, res) {
    try {
      const { full_name, department, phone } = req.body;
      
      const result = await pool.query(
        `UPDATE users 
         SET full_name = COALESCE($1, full_name),
             department = COALESCE($2, department),
             phone = COALESCE($3, phone),
             updated_at = NOW()
         WHERE id = $4
         RETURNING id, email, full_name, role, department, phone, avatar_url`,
        [full_name, department, phone, req.user.id]
      );

      await logActivity(req.user.id, 'PROFILE_UPDATED', 'User updated profile', req.ip);

      res.json({
        success: true,
        message: 'Profile updated successfully',
        user: result.rows[0]
      });
    } catch (error) {
      console.error('Update profile error:', error);
      res.status(500).json({ error: 'Failed to update profile' });
    }
  }

  /**
   * Change password
   */
  async changePassword(req, res) {
    try {
      const { current_password, new_password } = req.body;

      // Get user with password
      const result = await pool.query(
        'SELECT password FROM users WHERE id = $1',
        [req.user.id]
      );

      const user = result.rows[0];

      // Verify current password
      const validPassword = await bcrypt.compare(current_password, user.password);
      if (!validPassword) {
        return res.status(400).json({ error: 'Current password is incorrect' });
      }

      // Hash new password
      const hashedPassword = await bcrypt.hash(new_password, 10);

      // Update password
      await pool.query(
        'UPDATE users SET password = $1, updated_at = NOW() WHERE id = $2',
        [hashedPassword, req.user.id]
      );

      await logActivity(req.user.id, 'PASSWORD_CHANGED', 'User changed password', req.ip);

      res.json({
        success: true,
        message: 'Password changed successfully'
      });
    } catch (error) {
      console.error('Change password error:', error);
      res.status(500).json({ error: 'Failed to change password' });
    }
  }

  /**
   * Logout (optional - can be handled client-side)
   */
  async logout(req, res) {
    try {
      await logActivity(req.user.id, 'USER_LOGOUT', 'User logged out', req.ip);

      res.json({
        success: true,
        message: 'Logged out successfully'
      });
    } catch (error) {
      console.error('Logout error:', error);
      res.status(500).json({ error: 'Logout failed' });
    }
  }
}

module.exports = new AuthController();