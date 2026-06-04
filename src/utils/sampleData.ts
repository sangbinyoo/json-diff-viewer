export const SAMPLE_A = {
  user: {
    id: 1,
    name: '홍길동',
    email: 'hong@example.com',
    age: 28,
    role: 'user',
    settings: {
      theme: 'light',
      language: 'ko',
      notifications: true,
    },
  },
  products: [
    { id: 101, name: '노트북', price: 1200000 },
    { id: 102, name: '마우스', price: 35000 },
  ],
  version: '1.0.0',
  createdAt: '2024-01-01',
}

export const SAMPLE_B = {
  user: {
    id: 1,
    name: '홍길동',
    email: 'gildong@example.com',
    age: 29,
    role: 'admin',
    settings: {
      theme: 'dark',
      language: 'ko',
      notifications: false,
      fontSize: 14,
    },
  },
  products: [
    { id: 101, name: '노트북', price: 1350000 },
    { id: 102, name: '마우스', price: 35000 },
    { id: 103, name: '키보드', price: 89000 },
  ],
  version: '2.0.0',
  updatedAt: '2024-06-01',
}
