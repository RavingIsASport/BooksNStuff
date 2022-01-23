const { User } = require("../models/User");
const { signToken } = require("../utils/auth");

const resolvers = {
  Query: {
    me: async (parents, args, context) => {
      const userData = await User.findOne({ _id: context.user_id });
      return userData;
    },
  },

  Mutation: {
    adduser: async (parents, args) => {
      const user = await User.create(args);

      if (!user) {
        return res.status(400).json({ message: "Something is wrong!" });
      }
      const token = signToken(user);
      res.json({ token, user });
      return user;
    },
    login: async (parents, { email, password }) => {
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({ message: "Can't find this user" });
      }

      const correctPw = await user.isCorrectPassword(password);

      if (!correctPw) {
        return res.status(400).json({ message: "Wrong password!" });
      }
      const token = signToken(user);
      res.json({ token, user });
    },
    saveBook: async (parents, { bookData }, context) => {
      const updatedUser = await User.findOneAndUpdate(
        { _id: context._id },
        { $addToSet: { savedBooks: bookData } },
        { new: true, runValidators: true }
      );
      return updatedUser;
    },
    removeBook: async (parents, { bookData }, context) => {
      const updatedUser = await User.findOneAndUpdate(
        { _id: context._id },
        { $pull: { savedBooks: bookData } },
        { new: true }
      );

      return updatedUser;
    },
  },
};
