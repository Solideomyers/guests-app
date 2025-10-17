import { PrismaClient, GuestStatus } from '@prisma/client';

const prisma = new PrismaClient();

// Raw data from constants.ts - All 71 guests
const rawData = [
  {
    Nombre: 'Francisco',
    Apellido: 'Myers',
    Estado: 'Bolívar',
    Ciudad: 'Guayana',
    Iglesia: 'Gracia Eterna',
  },
  {
    Nombre: 'Devinica',
    Apellido: 'De Myers',
    Estado: 'Bolívar',
    Ciudad: 'Guayana',
    Iglesia: 'Gracia Eterna',
  },
  {
    Nombre: 'Lemuel',
    Apellido: 'Soto',
    Estado: 'Bolívar',
    Ciudad: 'Guayana',
    Iglesia: 'Gracia Eterna',
  },
  {
    Nombre: 'Aydana',
    Apellido: 'De Soto',
    Estado: 'Bolívar',
    Ciudad: 'Guayana',
    Iglesia: 'Gracia Eterna',
  },
  {
    Nombre: 'Anniel',
    Apellido: 'Alonso',
    Estado: 'Bolívar',
    Ciudad: 'Guayana',
    Iglesia: 'Gracia Eterna',
  },
  {
    Nombre: 'Betzaida',
    Apellido: 'Bellorin',
    Estado: 'Bolívar',
    Ciudad: 'Guayana',
    Iglesia: 'Gracia Eterna',
  },
  {
    Nombre: 'Carina',
    Apellido: 'De Duque',
    Estado: 'Bolívar',
    Ciudad: 'Guayana',
    Iglesia: 'Gracia Eterna',
  },
  {
    Nombre: 'Carlos',
    Apellido: 'Quijada',
    Estado: 'Bolívar',
    Ciudad: 'Guayana',
    Iglesia: 'Gracia Eterna',
  },
  {
    Nombre: 'Secia',
    Apellido: 'De Quijada',
    Estado: 'Bolívar',
    Ciudad: 'Guayana',
    Iglesia: 'Gracia Eterna',
  },
  {
    Nombre: 'Edinson',
    Apellido: 'Salazar',
    Estado: 'Bolívar',
    Ciudad: 'Guayana',
    Iglesia: 'Gracia Eterna',
  },
  {
    Nombre: 'Patricia',
    Apellido: 'De Salazar',
    Estado: 'Bolívar',
    Ciudad: 'Guayana',
    Iglesia: 'Gracia Eterna',
  },
  {
    Nombre: 'Eduardo',
    Apellido: 'Salazar',
    Estado: 'Bolívar',
    Ciudad: 'Guayana',
    Iglesia: 'Gracia Eterna',
  },
  {
    Nombre: 'Orlando',
    Apellido: 'Soto',
    Estado: 'Bolívar',
    Ciudad: 'Guayana',
    Iglesia: 'Gracia Eterna',
  },
  {
    Nombre: 'Nancy',
    Apellido: 'De Soto',
    Estado: 'Bolívar',
    Ciudad: 'Guayana',
    Iglesia: 'Gracia Eterna',
  },
  {
    Nombre: 'Misael',
    Apellido: 'Medina',
    Estado: 'Bolívar',
    Ciudad: 'Guayana',
    Iglesia: 'Gracia Eterna',
  },
  {
    Nombre: 'Thersy',
    Apellido: 'De Medina',
    Estado: 'Bolívar',
    Ciudad: 'Guayana',
    Iglesia: 'Gracia Eterna',
  },
  {
    Nombre: 'Maggui',
    Apellido: 'Kufatti',
    Estado: 'Bolívar',
    Ciudad: 'Guayana',
    Iglesia: 'Gracia Eterna',
  },
  {
    Nombre: 'Julián',
    Apellido: 'Medina',
    Estado: 'Bolívar',
    Ciudad: 'Guayana',
    Iglesia: 'Gracia Eterna',
  },
  {
    Nombre: 'Luisana',
    Apellido: 'Mota',
    Estado: 'Bolívar',
    Ciudad: 'Guayana',
    Iglesia: 'Gracia Eterna',
  },
  {
    Nombre: 'Luisanny',
    Apellido: 'Mota',
    Estado: 'Bolívar',
    Ciudad: 'Guayana',
    Iglesia: 'Gracia Eterna',
  },
  {
    Nombre: 'Norelis',
    Apellido: 'Torres',
    Estado: 'Bolívar',
    Ciudad: 'Guayana',
    Iglesia: 'Gracia Eterna',
  },
  {
    Nombre: 'Omaira',
    Apellido: 'Afanador',
    Estado: 'Bolívar',
    Ciudad: 'Guayana',
    Iglesia: 'Gracia Eterna',
  },
  {
    Nombre: 'Rosita',
    Apellido: 'De Moncada',
    Estado: 'Bolívar',
    Ciudad: 'Guayana',
    Iglesia: 'Gracia Eterna',
  },
  {
    Nombre: 'Ivana',
    Apellido: 'Moncada',
    Estado: 'Bolívar',
    Ciudad: 'Guayana',
    Iglesia: 'Gracia Eterna',
  },
  {
    Nombre: 'Vicenta',
    Apellido: '',
    Estado: 'Bolívar',
    Ciudad: 'Guayana',
    Iglesia: 'Gracia Eterna',
  },
  {
    Nombre: 'Douglas',
    Apellido: '',
    Estado: 'Bolívar',
    Ciudad: 'Guayana',
    Iglesia: 'Gracia Eterna',
  },
  {
    Nombre: 'Keyla',
    Apellido: '',
    Estado: 'Bolívar',
    Ciudad: 'Guayana',
    Iglesia: 'Gracia Eterna',
  },
  {
    Nombre: 'Zaidé',
    Apellido: '',
    Estado: 'Bolívar',
    Ciudad: 'Guayana',
    Iglesia: 'Gracia Eterna',
  },
  {
    Nombre: 'Sherly',
    Apellido: '',
    Estado: 'Bolívar',
    Ciudad: 'Guayana',
    Iglesia: 'Gracia Eterna',
  },
  {
    Nombre: 'Brianna',
    Apellido: 'Becerra',
    Estado: 'Bolívar',
    Ciudad: 'Guayana',
    Iglesia: 'Gracia Eterna',
  },
  {
    Nombre: 'Benjamín',
    Apellido: 'Rodriguez',
    Estado: 'Bolívar',
    Ciudad: 'Guayana',
    Iglesia: 'Gracia Eterna',
  },
  {
    Nombre: 'José',
    Apellido: 'Díaz',
    Estado: 'Bolívar',
    Ciudad: 'Guayana',
    Iglesia: 'Gracia Eterna',
  },
  {
    Nombre: 'Héctor',
    Apellido: '',
    Estado: 'Bolívar',
    Ciudad: 'Guayana',
    Iglesia: 'Gracia Eterna',
  },
  {
    Nombre: 'Sugeida',
    Apellido: '',
    Estado: 'Bolívar',
    Ciudad: 'Guayana',
    Iglesia: 'Gracia Eterna',
  },
  {
    Nombre: 'Antonio',
    Apellido: '',
    Estado: 'Bolívar',
    Ciudad: 'Guayana',
    Iglesia: 'Gracia Eterna',
  },
  {
    Nombre: 'Vanesa',
    Apellido: '',
    Estado: 'Bolívar',
    Ciudad: 'Guayana',
    Iglesia: 'Gracia Eterna',
  },
  {
    Nombre: 'Omar',
    Apellido: 'Gonzalez',
    Estado: 'Bolívar',
    Ciudad: 'Guayana',
    Iglesia: 'Gracia Eterna',
  },
  {
    Nombre: 'Dennis',
    Apellido: 'Cedeño',
    Estado: 'Bolívar',
    Ciudad: 'Guayana',
    Iglesia: 'Gracia Eterna',
  },
  {
    Nombre: 'Dany',
    Apellido: 'Cedeño',
    Estado: 'Bolívar',
    Ciudad: 'Guayana',
    Iglesia: 'Gracia Eterna',
  },
  {
    Nombre: 'Daniela',
    Apellido: 'Cedeño',
    Estado: 'Bolívar',
    Ciudad: 'Guayana',
    Iglesia: 'Gracia Eterna',
  },
  {
    Nombre: 'Hijo de Dennis',
    Apellido: '',
    Estado: 'Bolívar',
    Ciudad: 'Guayana',
    Iglesia: 'Gracia Eterna',
  },
  {
    Nombre: 'Edgar',
    Apellido: 'Salazar',
    Estado: 'Bolívar',
    Ciudad: 'Guayana',
    Iglesia: 'Gracia Eterna',
  },
  {
    Nombre: 'Joiner',
    Apellido: '',
    Estado: 'Bolívar',
    Ciudad: 'Guayana',
    Iglesia: 'Gracia Eterna',
  },
  {
    Nombre: 'Yedris',
    Apellido: '',
    Estado: 'Bolívar',
    Ciudad: 'Guayana',
    Iglesia: 'Gracia Eterna',
  },
  {
    Nombre: 'Elías',
    Apellido: '',
    Estado: 'Bolívar',
    Ciudad: 'Guayana',
    Iglesia: 'Gracia Eterna',
  },
  {
    Nombre: 'Uneidis',
    Apellido: '',
    Estado: 'Bolívar',
    Ciudad: 'Guayana',
    Iglesia: 'Gracia Eterna',
  },
  {
    Nombre: 'Sari',
    Apellido: '',
    Estado: 'Bolívar',
    Ciudad: 'Guayana',
    Iglesia: 'Gracia Eterna',
  },
  {
    Nombre: 'Esposo de Sari',
    Apellido: '',
    Estado: 'Bolívar',
    Ciudad: 'Guayana',
    Iglesia: 'Gracia Eterna',
  },
  {
    Nombre: 'Yadcidy',
    Apellido: '',
    Estado: 'Bolívar',
    Ciudad: 'Guayana',
    Iglesia: 'Gracia Eterna',
  },
  {
    Nombre: 'Alan',
    Apellido: '',
    Estado: 'Bolívar',
    Ciudad: 'Guayana',
    Iglesia: 'Gracia Eterna',
  },
  {
    Nombre: 'Richard',
    Apellido: '',
    Estado: 'Bolívar',
    Ciudad: 'Guayana',
    Iglesia: 'Gracia Eterna',
  },
  {
    Nombre: 'Yelitza',
    Apellido: '',
    Estado: 'Bolívar',
    Ciudad: 'Guayana',
    Iglesia: 'Gracia Eterna',
  },
  {
    Nombre: 'Ricardo',
    Apellido: '',
    Estado: 'Bolívar',
    Ciudad: 'Guayana',
    Iglesia: 'Gracia Eterna',
  },
  {
    Nombre: 'Reichel',
    Apellido: '',
    Estado: 'Bolívar',
    Ciudad: 'Guayana',
    Iglesia: 'Gracia Eterna',
  },
  {
    Nombre: 'María',
    Apellido: '',
    Estado: 'Bolívar',
    Ciudad: 'Guayana',
    Iglesia: 'Gracia Eterna',
  },
  {
    Nombre: 'José',
    Apellido: '',
    Estado: 'Bolívar',
    Ciudad: 'Guayana',
    Iglesia: 'Gracia Eterna',
  },
  {
    Nombre: 'Alirio',
    Apellido: 'Moncada',
    Estado: 'Bolívar',
    Ciudad: 'Guayana',
    Iglesia: 'Gracia Eterna',
  },
  {
    Nombre: 'Frank',
    Apellido: 'Myers',
    Estado: 'Bolívar',
    Ciudad: 'Guayana',
    Iglesia: 'Gracia Eterna',
  },
  {
    Nombre: 'Andrew',
    Apellido: 'Myers',
    Estado: 'Bolívar',
    Ciudad: 'Guayana',
    Iglesia: 'Gracia Eterna',
  },
  {
    Nombre: 'Abraham',
    Apellido: '',
    Estado: 'Bolívar',
    Ciudad: 'Guayana',
    Iglesia: 'Gracia Eterna',
  },
  {
    Nombre: 'Emanuel',
    Apellido: '',
    Estado: 'Bolívar',
    Ciudad: 'Guayana',
    Iglesia: 'Gracia Eterna',
  },
  {
    Nombre: 'Bryan',
    Apellido: '',
    Estado: 'Bolívar',
    Ciudad: 'Guayana',
    Iglesia: 'Gracia Eterna',
  },
  {
    Nombre: 'Alondra',
    Apellido: '',
    Estado: 'Bolívar',
    Ciudad: 'Guayana',
    Iglesia: 'Gracia Eterna',
  },
  {
    Nombre: 'Aranza',
    Apellido: '',
    Estado: 'Bolívar',
    Ciudad: 'Guayana',
    Iglesia: 'Gracia Eterna',
  },
  {
    Nombre: 'Darío',
    Apellido: 'Medina',
    Estado: 'Bolívar',
    Ciudad: 'Guayana',
    Iglesia: 'Gracia Eterna',
  },
  {
    Nombre: 'Nataly',
    Apellido: '',
    Estado: 'Bolívar',
    Ciudad: 'Guayana',
    Iglesia: 'Gracia Eterna',
  },
  {
    Nombre: 'Hijo de Ana Hidrogo',
    Apellido: '',
    Estado: 'Bolívar',
    Ciudad: 'Guayana',
    Iglesia: 'Gracia Eterna',
  },
  {
    Nombre: 'Hija de Ana Hidrogo',
    Apellido: '',
    Estado: 'Bolívar',
    Ciudad: 'Guayana',
    Iglesia: 'Gracia Eterna',
  },
  {
    Nombre: 'Hijo de Douglas y Keyla',
    Apellido: '',
    Estado: 'Bolívar',
    Ciudad: 'Guayana',
    Iglesia: 'Gracia Eterna',
  },
  {
    Nombre: 'Hijo de Douglas y Keyla (2)',
    Apellido: '',
    Estado: 'Bolívar',
    Ciudad: 'Guayana',
    Iglesia: 'Gracia Eterna',
  },
];

async function main() {
  console.log('🌱 Starting seed...');

  // Clear existing data
  console.log('🗑️  Clearing existing data...');
  await prisma.guestHistory.deleteMany();
  await prisma.guest.deleteMany();

  console.log('📝 Creating guests...');

  for (const data of rawData) {
    await prisma.guest.create({
      data: {
        firstName: data.Nombre.trim(),
        lastName: data.Apellido?.trim() || '',
        state: data.Estado?.trim() || '',
        city: data.Ciudad?.trim() || '',
        church: data.Iglesia?.trim() || '',
        status: GuestStatus.PENDING,
        isPastor: false,
      },
    });
  }

  const count = await prisma.guest.count();
  console.log(`✅ Seeded ${count} guests successfully!`);
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
