import prisma from "@utils/db";

const newTags = [
  "Art", "Artificial Intelligence", "Community", "Cryptocurrency", 
  "Cultural Trends", "Business", "Economy", "Engineering", 
  "Environment", "Gender and Sexuality", "History", "Justice", 
  "Literature", "Math", "Music", "Philosophy", "Physics", 
  "Photography", "Poetry", "Politics", "Psychology", 
  "Progress Studies", "Religion", "Science", "Sociology", 
  "Spirituality", "Technology", "World Affairs"
];

async function main() {
  await prisma.tag.createMany({
    data: newTags.map(label => ({ label })),
    skipDuplicates: true,
  });
  console.log("Tags have been added to the database.");
}

main()
  .catch(e => {
    throw e;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
