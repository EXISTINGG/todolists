import bcrypt from 'bcryptjs';

// 加密函数
function encrypt(text) {
  const salt = bcrypt.genSaltSync(10);
  const hash = bcrypt.hashSync(text, salt);
  return hash;
}

// 解密函数
function decrypt(text, hash) {
  return bcrypt.compareSync(text, hash);
}

export default {
  encrypt,
  decrypt
}
