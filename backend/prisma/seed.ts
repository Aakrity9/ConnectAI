import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Clean old data
  await prisma.groupMember.deleteMany({});
  await prisma.group.deleteMany({});
  await prisma.message.deleteMany({});
  await prisma.connectionRequest.deleteMany({});
  await prisma.profile.deleteMany({});
  await prisma.user.deleteMany({});

  // 1. Create Users
  const user1 = await prisma.user.create({
    data: {
      email: 'aarav@connectai.test',
      clerkId: 'user_aarav123',
    },
  });

  const user2 = await prisma.user.create({
    data: {
      email: 'priya@connectai.test',
      clerkId: 'user_priya456',
    },
  });

  const user3 = await prisma.user.create({
    data: {
      email: 'rahul@connectai.test',
      clerkId: 'user_rahul789',
    },
  });

  // 2. Create Profiles
  const profile1 = await prisma.profile.create({
    data: {
      userId: user1.id,
      name: 'Aarav Sharma',
      photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d',
      college: 'IIT Delhi',
      degree: 'B.Tech Computer Science',
      experience: '2 years (Internships)',
      skills: ['React', 'TypeScript', 'Node.js', 'Next.js', 'Python', 'PyTorch'],
      interests: ['AI Agents', 'Generative AI', 'Fullstack Development', 'Hackathons'],
      careerGoals: ['Join an early stage AI startup', 'Build agentic developer tools'],
      startupInterest: true,
      hackathonInterest: true,
      lookingFor: ['Team', 'Co-founder', 'Mentor'],
      hobbies: ['Chess', 'Coding in the dark', 'Hiking'],
      availability: 'Weekends',
      attendingSolo: true,
    },
  });

  const profile2 = await prisma.profile.create({
    data: {
      userId: user2.id,
      name: 'Priya Patel',
      photo: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330',
      college: 'BITS Pilani',
      degree: 'M.Sc General Studies & MBA',
      experience: '4 years (Product Management)',
      skills: ['Product Strategy', 'UI/UX Design', 'User Research', 'Agile', 'Market Analysis'],
      interests: ['Startup Ideas', 'EdTech', 'Generative AI Applications', 'Venture Capital'],
      careerGoals: ['Found an AI-first education startup', 'Raise pre-seed funding'],
      startupInterest: true,
      hackathonInterest: false,
      lookingFor: ['Co-founder', 'Investors', 'Friends'],
      hobbies: ['Reading biographies', 'Sketching', 'Yoga'],
      availability: 'Full-time availability',
      attendingSolo: false,
    },
  });

  const profile3 = await prisma.profile.create({
    data: {
      userId: user3.id,
      name: 'Rahul Verma',
      photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e',
      college: 'DTU',
      degree: 'B.Tech Software Engineering',
      experience: '1 year',
      skills: ['Figma', 'UI Design', 'CSS', 'Tailwind', 'HTML', 'JavaScript'],
      interests: ['Design Systems', 'Micro-interactions', 'Frontend Engineering', 'Accessibility'],
      careerGoals: ['Create beautiful, accessible user interfaces for AI products'],
      startupInterest: false,
      hackathonInterest: true,
      lookingFor: ['Team', 'Friends'],
      hobbies: ['Photography', 'Gaming', 'Coffee Brewing'],
      availability: 'Evening hours',
      attendingSolo: true,
    },
  });

  // 3. Set Mock Vector Embeddings (1536 dimensions) using raw SQL updates
  // We'll generate simple mock vectors with high overlapping coordinates for testing
  const mockVector1 = Array(1536).fill(0.02);
  mockVector1[0] = 0.5; // Shared dimension
  mockVector1[1] = 0.3; // AI alignment

  const mockVector2 = Array(1536).fill(0.02);
  mockVector2[0] = 0.45; // Shared dimension
  mockVector2[1] = 0.28; // AI alignment
  mockVector2[2] = 0.4;  // Startup alignment

  const mockVector3 = Array(1536).fill(0.01);
  mockVector3[0] = 0.1;  // Unrelated dimension
  mockVector3[2] = 0.35; // Startup alignment

  const formatVectorSql = (vec: number[]) => `[${vec.join(',')}]`;

  console.log('Injecting mock vector embeddings...');
  await prisma.$executeRawUnsafe(
    `UPDATE "Profile" SET "embedding" = '${formatVectorSql(mockVector1)}'::vector WHERE "id" = '${profile1.id}'`
  );
  await prisma.$executeRawUnsafe(
    `UPDATE "Profile" SET "embedding" = '${formatVectorSql(mockVector2)}'::vector WHERE "id" = '${profile2.id}'`
  );
  await prisma.$executeRawUnsafe(
    `UPDATE "Profile" SET "embedding" = '${formatVectorSql(mockVector3)}'::vector WHERE "id" = '${profile3.id}'`
  );

  // 4. Create Connection Requests
  await prisma.connectionRequest.create({
    data: {
      senderId: profile1.id,
      receiverId: profile2.id,
      status: 'PENDING',
    },
  });

  // 5. Create Messages (Chat History)
  await prisma.connectionRequest.create({
    data: {
      senderId: profile3.id,
      receiverId: profile1.id,
      status: 'ACCEPTED',
    },
  });

  await prisma.message.create({
    data: {
      senderId: profile3.id,
      receiverId: profile1.id,
      content: 'Hey Aarav, I saw you are looking for hackathon teammates. I do UI design!',
    },
  });

  await prisma.message.create({
    data: {
      senderId: profile1.id,
      receiverId: profile3.id,
      content: 'Hey Rahul! Yes, awesome design portfolio! Let’s collaborate.',
    },
  });

  // 6. Create Group Circle
  const group = await prisma.group.create({
    data: {
      name: 'Generative AI Builders',
      description: 'A small circle for attendees hacking on AI agents and custom LLM tools.',
    },
  });

  await prisma.groupMember.create({
    data: {
      groupId: group.id,
      profileId: profile1.id,
    },
  });

  await prisma.groupMember.create({
    data: {
      groupId: group.id,
      profileId: profile3.id,
    },
  });

  console.log('Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
