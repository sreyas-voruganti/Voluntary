const { gql } = require("apollo-server-express");
const User = require("./models/User.model");
const Service = require("./models/Service.model");
const Session = require("./models/Session.model");

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
      contact: String
      user: User!
      createdAt: String!
      updatedAt: String!
      user_reports: [String]
    }
    type Session {
      _id: ID!
      user: User!
      service: Service!
      time: String!
      duration: Int!
      status: String!
      satisfaction: Int!
    }
    type Query {
      users: [User]
      services: [Service]
      sessions: [Session]
      user(_id: ID!): User
      service(_id: ID!): Service
      session(_id: ID!): Session
      my_user: User
      my_services: [Service]
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
      async sessions() {
        return await Session.find().populate("user").populate("service");
      },
      async user(parent, args) {
        return await User.findById(args._id).lean();
      },
      async service(parent, args) {
        return await Service.findById(args._id);
      },
      async session(parent, args) {
        return await Session.findById(args._id);
      },
      async my_user(parent, args, context) {
        return await User.findById(context.user._id);
      },
      async my_services(parent, args, context) {
        return await Service.find({ user: context.user._id }).populate("user");
      },
    },
  },
};
