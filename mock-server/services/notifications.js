import nodemailer from 'nodemailer';
import { config } from '../config/config.js';
import { AlertModel } from '../models/Alert.js';

/**
 * Email transporter configuration
 */
let transporter = null;

if (config.EMAIL.enabled) {
  transporter = nodemailer.createTransport({
    service: config.EMAIL.service,
    auth: {
      user: config.EMAIL.user,
      pass: config.EMAIL.password,
    },
  });
}

/**
 * Send email alert
 */
export async function sendEmailAlert(alert) {
  if (!config.EMAIL.enabled || !transporter) {
    console.log('Email notifications disabled');
    return false;
  }

  try {
    const message = {
      from: config.EMAIL.from,
      to: alert.user.email,
      subject: `Air Quality Alert: ${alert.pollutant.toUpperCase()} threshold exceeded`,
      html: `
        <h2>Air Quality Alert</h2>
        <p>A pollutant threshold has been exceeded at one of your monitored devices.</p>
        <h3>Alert Details:</h3>
        <ul>
          <li><strong>Device:</strong> ${alert.deviceName}</li>
          <li><strong>Location:</strong> ${alert.deviceLocation || 'N/A'}</li>
          <li><strong>Pollutant:</strong> ${alert.pollutant.toUpperCase()}</li>
          <li><strong>Threshold:</strong> ${alert.threshold}</li>
          <li><strong>Current Value:</strong> ${alert.currentValue}</li>
          <li><strong>AQI:</strong> ${alert.aqi}</li>
          <li><strong>Alert Level:</strong> ${alert.alertLevel}</li>
        </ul>
        <p>Please take appropriate precautions based on the air quality level.</p>
      `,
    };

    await transporter.sendMail(message);
    console.log(`Email alert sent to ${alert.user.email}`);
    return true;
  } catch (error) {
    console.error('Failed to send email alert:', error);
    return false;
  }
}

/**
 * Check thresholds and create alerts
 */
export async function checkThresholds(reading) {
  const { deviceId, pm25, pm10, co, no2, aqi } = reading;

  const thresholds = config.ALERT_THRESHOLDS;
  const alerts = [];

  // Check each pollutant
  if (pm25 && pm25 > thresholds.pm25) {
    alerts.push({
      deviceId,
      pollutant: 'pm25',
      threshold: thresholds.pm25,
      currentValue: pm25,
      aqi,
      alertLevel: determineAlertLevel(pm25, thresholds.pm25),
    });
  }

  if (pm10 && pm10 > thresholds.pm10) {
    alerts.push({
      deviceId,
      pollutant: 'pm10',
      threshold: thresholds.pm10,
      currentValue: pm10,
      aqi,
      alertLevel: determineAlertLevel(pm10, thresholds.pm10),
    });
  }

  if (co && co > thresholds.co) {
    alerts.push({
      deviceId,
      pollutant: 'co',
      threshold: thresholds.co,
      currentValue: co,
      aqi,
      alertLevel: determineAlertLevel(co, thresholds.co),
    });
  }

  if (no2 && no2 > thresholds.no2) {
    alerts.push({
      deviceId,
      pollutant: 'no2',
      threshold: thresholds.no2,
      currentValue: no2,
      aqi,
      alertLevel: determineAlertLevel(no2, thresholds.no2),
    });
  }

  // Create alerts in database
  for (const alert of alerts) {
    await AlertModel.create({
      userId: null, // TODO: Get user from device subscriptions
      ...alert,
    });
  }

  return alerts;
}

/**
 * Determine alert level based on value and threshold
 */
function determineAlertLevel(value, threshold) {
  const ratio = value / threshold;
  
  if (ratio >= 3) return 'critical';
  if (ratio >= 2) return 'severe';
  return 'moderate';
}

/**
 * Send SMS alert (placeholder)
 */
export async function sendSMSAlert(alert) {
  // TODO: Implement SMS service (Twilio, etc.)
  console.log('SMS alert:', alert);
  return false;
}

/**
 * Send push notification (placeholder)
 */
export async function sendPushNotification(alert) {
  // TODO: Implement push notification service (FCM, etc.)
  console.log('Push notification:', alert);
  return false;
}

