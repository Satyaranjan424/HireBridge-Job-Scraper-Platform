export function sendSuccess(res, { statusCode = 200, message = 'Success', data = {}, meta } = {}) {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
    ...data,
    ...(meta ? { meta } : {}),
  });
}
