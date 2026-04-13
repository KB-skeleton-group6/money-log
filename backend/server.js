import jsonServer from 'json-server';
import fs from 'fs';

const server = jsonServer.create();
const router = jsonServer.router('db.json');
const middlewares = jsonServer.defaults();

server.use(middlewares);

// CORS 명시 (안전하게 전체 허용)
server.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept',
  );
  res.header(
    'Access-Control-Allow-Methods',
    'GET, POST, PUT, PATCH, DELETE, OPTIONS',
  );
  next();
});

// 라우터 연결
server.use(router);

const PORT = process.env.PORT || 3000;

server.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 JSON Server running on port ${PORT}`);

  const db = JSON.parse(fs.readFileSync('db.json', 'utf-8'));

  console.log('📌 Endpoints:');
  Object.keys(db).forEach((key) => {
    console.log(`http://localhost:${PORT}/${key}`);
  });

  console.log('');
});
