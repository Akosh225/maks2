/**
 * data.js
 * Единый источник данных об автомобилях.
 * В реальном проекте это был бы ответ API/базы данных — здесь для учебного
 * проекта используется статический массив, доступный всем страницам
 * через глобальную переменную CARS (без модулей, чтобы файлы можно было
 * открывать напрямую через file:// без сервера).
 */

const CARS = [
  {
    id: 1,
    brand: "Toyota",
    model: "Camry",
    year: 2024,
    condition: "new",
    bodyType: "sedan",
    price: 16500000,
    mileage: 0,
    fuel: "Бензин",
    transmission: "Автомат",
    engine: "2.5 л, 181 л.с.",
    drive: "Передний",
    color: "Белый жемчуг",
    image: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=900&h=600&q=85",
    gallery: [
      "https://placehold.co/900x600/1b1e23/e8a23d?text=Toyota+Camry+1",
      "https://placehold.co/900x600/21252b/e8a23d?text=Toyota+Camry+2"
    ],
    description:
      "Свежее поколение Camry с завода: полный пакет ассистентов водителя, панорамная крыша и фирменная плавность хода Toyota."
  },
  {
    id: 2,
    brand: "Hyundai",
    model: "Tucson",
    year: 2023,
    condition: "used",
    bodyType: "suv",
    price: 12900000,
    mileage: 34000,
    fuel: "Бензин",
    transmission: "Автомат",
    engine: "2.0 л, 156 л.с.",
    drive: "Полный",
    color: "Серый графит",
    image: "https://images.unsplash.com/photo-1553440569-bcc63803a83d?auto=format&fit=crop&w=900&h=600&q=85",
    gallery: [
      "https://placehold.co/900x600/1b1e23/4f8a91?text=Hyundai+Tucson+1",
      "https://placehold.co/900x600/21252b/4f8a91?text=Hyundai+Tucson+2"
    ],
    description:
      "Один владелец, полная сервисная история у официального дилера. Полный привод — уверенно чувствует себя на зимних дорогах."
  },
  {
    id: 3,
    brand: "Kia",
    model: "K5",
    year: 2024,
    condition: "new",
    bodyType: "sedan",
    price: 14200000,
    mileage: 0,
    fuel: "Бензин",
    transmission: "Автомат",
    engine: "1.6 л турбо, 180 л.с.",
    drive: "Передний",
    color: "Синий металлик",
    image: "https://images.unsplash.com/photo-1542362567-b07e54358753?auto=format&fit=crop&w=900&h=600&q=85",
    gallery: [
      "https://placehold.co/900x600/1b1e23/e8a23d?text=Kia+K5+1",
      "https://placehold.co/900x600/21252b/e8a23d?text=Kia+K5+2"
    ],
    description:
      "Спортивный силуэт купе-седана, турбомотор и полностью цифровая приборная панель — для тех, кто ценит динамику."
  },
  {
    id: 4,
    brand: "Lada",
    model: "Vesta",
    year: 2022,
    condition: "used",
    bodyType: "sedan",
    price: 4600000,
    mileage: 58000,
    fuel: "Бензин",
    transmission: "Механика",
    engine: "1.6 л, 106 л.с.",
    drive: "Передний",
    color: "Красный",
    image: "https://placehold.co/640x420/1b1e23/4f8a91?text=Lada+Vesta",
    gallery: [
      "https://placehold.co/900x600/1b1e23/4f8a91?text=Lada+Vesta+1",
      "https://placehold.co/900x600/21252b/4f8a91?text=Lada+Vesta+2"
    ],
    description:
      "Экономичный городской седан с низким расходом топлива. Отличный вариант для первого автомобиля."
  },
  {
    id: 5,
    brand: "Chevrolet",
    model: "Tracker",
    year: 2024,
    condition: "new",
    bodyType: "suv",
    price: 9800000,
    mileage: 0,
    fuel: "Бензин",
    transmission: "Автомат",
    engine: "1.5 л, 111 л.с.",
    drive: "Передний",
    color: "Чёрный",
    image: "https://placehold.co/640x420/1b1e23/e8a23d?text=Chevrolet+Tracker",
    gallery: [
      "https://placehold.co/900x600/1b1e23/e8a23d?text=Chevrolet+Tracker+1",
      "https://placehold.co/900x600/21252b/e8a23d?text=Chevrolet+Tracker+2"
    ],
    description:
      "Компактный кроссовер с высокой посадкой и вместительным багажником — популярный выбор для семьи."
  },
  {
    id: 6,
    brand: "Volkswagen",
    model: "Polo",
    year: 2021,
    condition: "used",
    bodyType: "hatchback",
    price: 6200000,
    mileage: 71000,
    fuel: "Бензин",
    transmission: "Механика",
    engine: "1.6 л, 110 л.с.",
    drive: "Передний",
    color: "Серебристый",
    image: "https://placehold.co/640x420/1b1e23/4f8a91?text=VW+Polo",
    gallery: [
      "https://placehold.co/900x600/1b1e23/4f8a91?text=VW+Polo+1",
      "https://placehold.co/900x600/21252b/4f8a91?text=VW+Polo+2"
    ],
    description:
      "Надёжный немецкий хэтчбек с небольшим расходом топлива, отлично подходит для города."
  },
  {
    id: 7,
    brand: "BMW",
    model: "3 серии",
    year: 2023,
    condition: "used",
    bodyType: "sedan",
    price: 21500000,
    mileage: 22000,
    fuel: "Бензин",
    transmission: "Автомат",
    engine: "2.0 л турбо, 184 л.с.",
    drive: "Задний",
    color: "Синий",
    image: "https://placehold.co/640x420/1b1e23/4f8a91?text=BMW+3",
    gallery: [
      "https://placehold.co/900x600/1b1e23/4f8a91?text=BMW+3+1",
      "https://placehold.co/900x600/21252b/4f8a91?text=BMW+3+2"
    ],
    description:
      "Заднеприводная динамика и премиальный салон. Автомобиль после одного владельца, без ДТП."
  },
  {
    id: 8,
    brand: "Mercedes-Benz",
    model: "GLC",
    year: 2024,
    condition: "new",
    bodyType: "suv",
    price: 34900000,
    mileage: 0,
    fuel: "Бензин",
    transmission: "Автомат",
    engine: "2.0 л турбо, 204 л.с.",
    drive: "Полный",
    color: "Белый",
    image: "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=900&h=600&q=85",
    gallery: [
      "https://placehold.co/900x600/1b1e23/e8a23d?text=Mercedes+GLC+1",
      "https://placehold.co/900x600/21252b/e8a23d?text=Mercedes+GLC+2"
    ],
    description:
      "Флагманский комфорт и полный привод 4MATIC. Топовая комплектация с полным пакетом безопасности."
  },
  {
    id: 9,
    brand: "Renault",
    model: "Duster",
    year: 2022,
    condition: "used",
    bodyType: "suv",
    price: 8100000,
    mileage: 45000,
    fuel: "Бензин",
    transmission: "Механика",
    engine: "1.6 л, 114 л.с.",
    drive: "Полный",
    color: "Коричневый",
    image: "https://placehold.co/640x420/1b1e23/4f8a91?text=Renault+Duster",
    gallery: [
      "https://placehold.co/900x600/1b1e23/4f8a91?text=Renault+Duster+1",
      "https://placehold.co/900x600/21252b/4f8a91?text=Renault+Duster+2"
    ],
    description:
      "Простой в обслуживании внедорожник с полным приводом — уверенно едет по бездорожью и снегу."
  },
  {
    id: 10,
    brand: "Nissan",
    model: "Almera",
    year: 2024,
    condition: "new",
    bodyType: "sedan",
    price: 8900000,
    mileage: 0,
    fuel: "Бензин",
    transmission: "Автомат",
    engine: "1.6 л, 114 л.с.",
    drive: "Передний",
    color: "Серый",
    image: "https://placehold.co/640x420/1b1e23/e8a23d?text=Nissan+Almera",
    gallery: [
      "https://placehold.co/900x600/1b1e23/e8a23d?text=Nissan+Almera+1",
      "https://placehold.co/900x600/21252b/e8a23d?text=Nissan+Almera+2"
    ],
    description:
      "Простой, экономичный и надёжный седан для ежедневных поездок по городу."
  },
  {
    id: 11,
    brand: "Toyota",
    model: "Land Cruiser Prado",
    year: 2021,
    condition: "used",
    bodyType: "suv",
    price: 26800000,
    mileage: 61000,
    fuel: "Дизель",
    transmission: "Автомат",
    engine: "2.8 л, 177 л.с.",
    drive: "Полный",
    color: "Чёрный",
    image: "https://placehold.co/640x420/1b1e23/4f8a91?text=Land+Cruiser+Prado",
    gallery: [
      "https://placehold.co/900x600/1b1e23/4f8a91?text=Prado+1",
      "https://placehold.co/900x600/21252b/4f8a91?text=Prado+2"
    ],
    description:
      "Легендарная проходимость и запас прочности. Проверенный дизельный мотор, полная история обслуживания."
  },
  {
    id: 12,
    brand: "Kia",
    model: "Sportage",
    year: 2024,
    condition: "new",
    bodyType: "suv",
    price: 15700000,
    mileage: 0,
    fuel: "Бензин",
    transmission: "Автомат",
    engine: "2.0 л, 156 л.с.",
    drive: "Полный",
    color: "Зелёный хаки",
    image: "https://images.unsplash.com/photo-1503736334956-4c8f8e92946d?auto=format&fit=crop&w=900&h=600&q=85",
    gallery: [
      "https://placehold.co/900x600/1b1e23/e8a23d?text=Kia+Sportage+1",
      "https://placehold.co/900x600/21252b/e8a23d?text=Kia+Sportage+2"
    ],
    description:
      "Смелый дизайн, просторный салон и богатая базовая комплектация — один из самых продаваемых кроссоверов."
  }
];
