import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
async function main() {

  const org = await prisma.accountType.upsert({
    where: { id: 1 },
    update: {},
    create: {
      type: 'ORGANIZATION',
    },
  });
  const user = await prisma.accountType.upsert({
    where: { id: 2 },
    update: {},
    create: {
      type: 'USER',
    },
  });

  const tom = await prisma.account.upsert({
    where: { email: 'alonso@prisma.io' }, // account ID 1
    update: {},
    create: {
      email: 'alonso@prisma.io',
      username: 'Alonso Oliveira',
      headline: 'Senior Software Engineer at Digital Ocean',
      photoUrl: 'https://media.licdn.com/dms/image/D4D0BAQEAFSZno0_znA/company-logo_100_100/0/1707299657994/digitalocean_logo?e=1721260800&v=beta&t=kldj5xzrq2sIg9PQR8ZVuvjbHmlPX2Vns2SlbHCRVfw',
      accountTypeId: 2,
      followerCount: 200,
    },
  });

  const carlos = await prisma.account.upsert({
    where: { email: 'carlosBonetta@prisma.io' }, // account ID 2
    update: {},
    create: {
      email: 'carlosBonetta@prisma.io',
      username: 'Carlos Bonetta',
      headline: 'Front End Software Engineer at Microsoft',
      photoUrl: 'https://media.licdn.com/dms/image/C560BAQE88xCsONDULQ/company-logo_100_100/0/1630652622688/microsoft_logo?e=1718841600&v=beta&t=o3_LLlGWjBdrq9Ex_KBG0ia_TejjAGWVreMRIbsNNzE',
      accountTypeId: 2,
      followerCount: 150,
    },
  });

  const adam = await prisma.account.upsert({
    where: { email: 'aj@prisma.io' }, // account ID 3
    update: {},
    create: {
      username: 'Adam Johnson',
      headline: 'Software Engineer | Founder',
      followerCount: 420,
      email: 'aj@prisma.io',
      photoUrl: 'https://media.licdn.com/dms/image/C4E0BAQFseuCCBupBOQ/company-logo_100_100/0/1651058102389/gitlab_com_logo?e=1718841600&v=beta&t=_qeQfxukh8YEG-xypc0OzoHKoN3_MQi8Qczcr_2H-SE',
      accountTypeId: 2,
    },
  });

  const lewis = await prisma.account.upsert({
    where: { email: 'lewis@prisma.io' }, // account ID 4
    update: {},
    create: {
      username: 'Lewis Hamilton',
      followerCount: 1890000,
      email: 'lewis@prisma.io',
      headline: 'Principal Software Engineer at Google',
      accountTypeId: 2,
      photoUrl: 'https://media.licdn.com/dms/image/C4D0BAQHiNSL4Or29cg/company-logo_100_100/0/1631311446380?e=1718841600&v=beta&t=DWcimyfKKV8LI50G9_WqtARLB2fXSBDyJc79IoP-O1A',
    },
  });

  const charles = await prisma.account.upsert({
    where: { email: 'charles@prisma.io' }, // account ID 5
    update: {},
    create: {
      username: 'Charles Leclerc',
      followerCount: 890200,
      email: 'charles@prisma.io',
      headline: 'Front End Software Engineer at Google',
      accountTypeId: 2,
      photoUrl: 'https://media.licdn.com/dms/image/C4D0BAQHiNSL4Or29cg/company-logo_100_100/0/1631311446380?e=1718841600&v=beta&t=DWcimyfKKV8LI50G9_WqtARLB2fXSBDyJc79IoP-O1A',
    },
  });

  const gitlab = await prisma.account.upsert({
    where: { email: 'gitlab@prisma.io' }, // account ID 6
    update: {},
    create: {
      username: 'GitLab',
      headline: '',
      followerCount: 3987000, // formatted server side
      email: '',
      photoUrl: 'https://media.licdn.com/dms/image/C4E0BAQFseuCCBupBOQ/company-logo_100_100/0/1651058102389/gitlab_com_logo?e=1718841600&v=beta&t=_qeQfxukh8YEG-xypc0OzoHKoN3_MQi8Qczcr_2H-SE',
      accountTypeId: 1,
    },
  });

  const daniel = await prisma.account.upsert({
    where: { email: 'daniel@prisma.io' }, // account ID 7
    update: {},
    create: {
      email: 'daniel@prisma.io',
      username: 'Daniel Ricciardo',
      headline: 'Senior Software Engineer at Microsoft',
      photoUrl: 'https://media.licdn.com/dms/image/C560BAQE88xCsONDULQ/company-logo_100_100/0/1630652622688/microsoft_logo?e=1718841600&v=beta&t=o3_LLlGWjBdrq9Ex_KBG0ia_TejjAGWVreMRIbsNNzE',
      accountTypeId: 2,
      followerCount: 1250654,
    },
  });

  const post1 = await prisma.post.upsert({
    where: { id: 1 },
    update: {},
    create: {
      content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
      title: 'Gitlab Dark Mode',
      createdBy: 6,
    },
  });

  const post2 = await prisma.post.upsert({
    where: { id: 2 },
    update: {},
    create: {
      content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
      title: '',
      createdBy: 2,
    },
  });

  const reactionInsights1 = await prisma.reactionInsights.upsert({
    where: { id: 1 },
    update: {},
    create: {
      likedBy: 3, // adam
      postId: 1,
    },
  });
  const reactionInsights2 = await prisma.reactionInsights.upsert({
    where: { id: 2 },
    update: {},
    create: {
      likedBy: 5, // charles
      postId: 1,
    },
  });

  const reactionInsights3 = await prisma.reactionInsights.upsert({
    where: { id: 3 },
    update: {},
    create: {
      likedBy: 1, // liked by tom/signin account
      postId: 1,
    },
  });

  const parentComment1 = await prisma.comment.upsert({
    where: { id: 1 },
    update: {},
    create: {
      body: 'Awesome Dark Mode Gitlab! Great Feature Add.',
      createdBy: 2,
      parentId: null,
      postId: 1,
    },
  });

  const childComment1 = await prisma.comment.upsert({
    where: { id: 2 },
    update: {},
    create: {
      body: 'We\'re excited to have delivered this feature! Thank you for the feedback!',
      createdBy: 3,
      parentId: 1,
      postId: 1,
    },
  });

  const childComment2 = await prisma.comment.upsert({
    where: { id: 3 },
    update: {},
    create: {
      body: 'Great Job Gitlab!',
      createdBy: 4,
      parentId: 1,
      postId: 1,
    },
  });

  const parentComment2 = await prisma.comment.upsert({
    where: { id: 4 },
    update: {},
    create: {
      body: 'This is AWESOME!',
      createdBy: 5,
      parentId: null,
      postId: 1,
    },
  });

  const childComment3 = await prisma.comment.upsert({
    where: { id: 5 },
    update: {},
    create: {
      body: 'Ditto!',
      createdBy: 7,
      parentId: 3,
      postId: 1,
    },
  });

  const reactionInsights4 = await prisma.reactionInsights.upsert({
    where: { id: 4 },
    update: {},
    create: {
      likedBy: 7, // liked by daniel ricciardo
      commentId: 3, // 'Great Job Comment
    },
  });

  console.log({
    org,
    user,
    tom,
    carlos,
    adam,
    lewis,
    charles,
    gitlab,
    daniel,
    post1,
    post2,
    reactionInsights1,
    reactionInsights2,
    reactionInsights3,
    reactionInsights4,
    parentComment1,
    childComment1,
    childComment2,
    childComment3,
    parentComment2,
  });
}
main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
