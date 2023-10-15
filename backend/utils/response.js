function success(ctx, data = [], message = 'success', status = 200) {
  ctx.body = {
    status,
    message,
    data
  }
}

function error(ctx, message, data = [], status = 400) {
  ctx.body = {
    status,
    message,
    data
  }
}

export default {
  success,
  error
}