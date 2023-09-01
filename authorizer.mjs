import jwt from "jsonwebtoken";

const { SECRET } = process.env;

export const jwtAuthorizer = async (event) => {
  const { authorizationToken, methodArn } = event;
  try {
    jwt.verify(authorizationToken, SECRET);
  } catch (err) {
    throw new Error("Unauthorized");
  }
  return {
    principalId: "user",
    policyDocument: {
      Version: "2012-10-17",
      Statement: [
        {
          Action: "execute-api:Invoke",
          Effect: "Allow",
          Resource: methodArn,
        },
      ],
    },
  };
};
