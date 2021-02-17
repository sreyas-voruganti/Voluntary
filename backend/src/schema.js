const { gql } = require("apollo-server-express");
const User = require("./models/User.model");
const Service = require("./models/Service.model");

module.exports = {
  typeDefs: gql`
    type User {
      _id: ID!
      name: String!
      email: String!
      pp: String!
      bio: String
      dob: String
      createdAt: String!
      updatedAt: String!
    }
    type Service {
      _id: ID!
      title: String!
      description: String!
      tags: [String]!
      image: String!
      unlisted: Boolean!
      contact: String!
      user: User!
      createdAt: String!
      updatedAt: String!
    }
    type Query {
      users: [User]
      services: [Service]
    }
  `,
  resolvers: {
    Query: {
      async users() {
        return await User.find().lean();
      },
      async services() {
        return await Service.find().populate("user");
      },
    },
  },
};
