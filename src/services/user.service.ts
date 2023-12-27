import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function removeUserById(id: string) {
  try {
    const user = await prisma.user.delete({
      where: {
        id: Number(id),
      },
    });
    return user;
  } catch (error) {
    return error;
  }
}

async function updateVerificationTokenById(id: string, token: string) {
  try {
    const user = await prisma.user.update({
      where: {
        id: Number(id),
      },
      data: {
        verificationToken: token,
      },
    });
    return user;
  } catch (error) {
    return error;
  }
}

async function findUnique(email: string) {
  try {
    const user = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });
    return user;
   
  } catch (error) {
    return error;
  }
}

async function findUniqueById(id: string) {
  try {
    const user = await prisma.user.findUnique({
      where: {
        id: Number(id),
      },
    });
    return user;
  } catch (error) {
    return error;
  }
}

async function findByUserName(username: string) {
  try {
    const user = await prisma.user.findUnique({
      where: {
        username: username,
      },
    });
    return user;
  } catch (error) {
    return error;
  }
}

async function findMany() {
  try {
    const users = await prisma.user.findMany();
    return users;
  } catch (error) {
    return error;
  }
}



async function findManyProfile() {
  try {
    const profiles = await prisma.userProfile.findMany();
    return profiles;
  } catch (error) {
    return error;
  }
}

async function updateProfile(
  username: string,
  firstname: string,
  lastname: string,
  phonenumber: string,
  country: string,
  state: string,
  city: string,
  address: string,
  zipcode: string
) {
  try {
    const user = await prisma.user.findUnique({
      where: {
        username: username,
      },
    });

    const profile = await prisma.userProfile.update({
      where: {
        username: username,
      },
      data: {
        firstname: firstname,
        lastname: lastname,
        phonenumber: phonenumber,
        country: country,
        state: state,
        city: city,
        address: address,
        zipcode: zipcode,
      },
    });
    return profile;
  } catch (error) {
    return error;
  }
}

async function create(
  username: string,
  email: string,
  password?: string,
  role: string,
  secret: string
) {
  try {
    const user = await prisma.user.create({
      data: {
        username,
        email,
        password?,
        role,
        secret,
      },
    });
    return user;
  } catch (error) {
    return error;
  }
}

async function updateRole(email: string, role: string) {
  try {
    const user = await prisma.user.update({
      where: {
        email: email,
      },
      data: {
        role: role,
      },
    });
    return user;
  } catch (error) {
    return error;
  }
}

async function updatePassword(email: string, password: string) {
  try {
    const user = await prisma.user.update({
      where: {
        email: email,
      },
      data: {
        password: password,
      },
    });
    return user;
  } catch (error) {
    return error;
  }
}

async function updateEmailById(id: Number, email: string) {
  console.log("id", id, "email", email)
  try {
    const user = await prisma.user.update({
      where: {
        id: id,
      },
      data: {
        email: email,
        emailVerified: false,
      },
    });
    return user;
  } catch (error) {
    return error;
  }
}

async function updateEmailVerifiedById(id: string, emailVerified: boolean) {
  try {
    const user = await prisma.user.update({
      where: {
        id: Number(id),
      },
      data: {
        emailVerified: true,
      },
    });
    return user;
  } catch (error) {
    return error;
  }
}

async function updateHasProfileById(id: string) {
  try {
    const user = await prisma.user.update({
      where: {
        id: Number(id),
      },
      data: {
        hasProfile: true,
      },
    });
    return user;
  } catch (error) {
    return error;
  }
}

async function pagination(page: any, limit: any) {
  try {
    const users = await prisma.user.findMany({
      skip: page,
      take: limit,
    });
    return users;
  } catch (error) {
    return error;
  }
}

async function createProfileData(
  username,
  firstname,
  lastname,
  phonenumber,
  country,
  state,
  city,
  address,
  zipcode
) {
  console.log("work¢")
  try {
    const user = await prisma.user.findUnique({
      where: {
        username: username,
      },
    });


    console.log("user", user);
    const profile = await prisma.userProfile.create({
      data: {
        firstname: firstname,
        lastname: lastname,
        phonenumber: phonenumber,
        country: country,
        state: state,
        city: city,
        address: address,
        zipcode: zipcode,
        user: {
          connect: {
            id: user?.id,
          },
        },
      },
    });

   const userUpdate = await prisma.user.update({
      where: {
        id: user?.id,
      },
      data: {
        userProfile: {
          connect: {
            id: profile?.id,
          },
        },
      },
    });  
    console.log("userUpdate", userUpdate, "profile", profile, "user", user)


    return profile;
  } catch (error) {
    return error;
  }
}

async function connectUserAndProfile(userId: Number, profileId: Number) {
  try {
    const user = await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        userProfile: {
          connect: {
            id: profileId,
          },
        },
      },
    });
    return user;
  } catch (error) {
    return error;
  }
}


export {
  findUnique,
  findMany,
  create,
  updateRole,
  updatePassword,
  findManyProfile,
  pagination,
  findByUserName,
  updateProfile,
  createProfileData,
  findUniqueById,
  updateEmailVerifiedById,
  updateEmailById,
  removeUserById,
  updateVerificationTokenById,
  updateHasProfileById,
  connectUserAndProfile
};
