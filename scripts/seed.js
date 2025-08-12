const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('iniciando seed...');

  for (let i = 1; i <= 5; i++) {
    await prisma.post.create({
      data: {
        title: `Test Post ${i}`,
        slug: `test-post-${i}`,
        excerpt: `Este es un post de prueba número ${i}.`,
        content: `# Test Post ${i}\n\nEste es un contenido de prueba para el post número ${i}. Puedes editar este contenido más tarde.\n\n**Este es un texto en negrita** y *este en cursiva*.\n\nGracias por usar StageStream.`,
        type: 'POST',
        published: true
      }
    });
  }

  console.log('Seed completado con éxito.');
  console.log('Entradas de prueba creadas.');
}

main()
  .catch((err) => {
    console.error('Error al ejecutar seed:', err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

/*
Credenciales sugeridas:
- Stage key: stagestream2025
- Usuario: admin
- Contraseña: 123456
*/
