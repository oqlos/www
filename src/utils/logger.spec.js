import { describe, it, expect, beforeEach } from 'vitest';
import logger from './logger.js';

describe('Logger', () => {
  beforeEach(() => {
    logger.clear();
  });

  it('should have log methods', () => {
    expect(typeof logger.trace).toBe('function');
    expect(typeof logger.debug).toBe('function');
    expect(typeof logger.info).toBe('function');
    expect(typeof logger.warn).toBe('function');
    expect(typeof logger.error).toBe('function');
  });

  it('should have clear method', () => {
    expect(typeof logger.clear).toBe('function');
    expect(typeof logger.clearLogs).toBe('function');
  });

  it('should have getLogs method', () => {
    expect(typeof logger.getLogs).toBe('function');
  });

  it('should have exportLogs method', () => {
    expect(typeof logger.exportLogs).toBe('function');
    const exported = logger.exportLogs();
    expect(exported).toHaveProperty('logs');
    expect(exported).toHaveProperty('exportedAt');
  });

  it('should buffer logs and retrieve them', () => {
    logger.info('buffered message', 'TestCtx', { x: 1 });
    const logs = logger.getLogs();
    expect(logs.length).toBeGreaterThanOrEqual(1);
    const last = logs[logs.length - 1];
    expect(last.message).toBe('buffered message');
    expect(last.component).toBe('TestCtx');
    expect(last.level).toBe('info');
  });

  it('should filter logs by level', () => {
    logger.warn('a warning');
    logger.info('an info');
    const warns = logger.getLogs('warn');
    expect(warns.every(l => l.level === 'warn')).toBe(true);
  });

  it('should call log methods without errors', () => {
    expect(() => logger.info('Test info', 'TestContext', { key: 'value' })).not.toThrow();
    expect(() => logger.warn('Test warning')).not.toThrow();
    expect(() => logger.error('Test error', null, { error: 'details' })).not.toThrow();
    expect(() => logger.debug('Test debug')).not.toThrow();
    expect(() => logger.trace('Test trace')).not.toThrow();
  });

  it('should clear without errors', () => {
    logger.info('Test');
    expect(() => logger.clear()).not.toThrow();
  });
});
