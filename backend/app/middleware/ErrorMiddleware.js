import response from "../../utils/response.js";

function ErrorMiddleware(ctx, next) {
  return next().catch((err) => {
    // 处理错误
    console.error('捕捉到错误：',err);

    response.error(ctx, err, [], 500)
  });
}

export default ErrorMiddleware;
