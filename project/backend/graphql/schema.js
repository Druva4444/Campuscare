const { GraphQLObjectType, GraphQLSchema, GraphQLString, GraphQLList } = require('graphql');
const Doctor = require('../model/doctor');


const DoctorType = new GraphQLObjectType({
  name: 'Doctor',
  fields: () => ({
    id: { type: GraphQLString },
    gmail: { type: GraphQLString },
    password: {type:GraphQLString},
    fields: { type: GraphQLString },
    college: { type: GraphQLString },
  }),
});


const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    doctors: {
      type: new GraphQLList(DoctorType),
      resolve() {
        return Doctor.find(); 
      },
    },
  },
});


const Mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    addDoctor: {
      type: DoctorType,
      args: {
        gmail: { type: GraphQLString },
        password:{type: GraphQLString},
        fields: { type: GraphQLString },
        college: { type: GraphQLString },
      },
      async resolve(parent, args) {
        const newDoctor = new Doctor({
          gmail: args.gmail,
          password:args.password,
          fields: args.fields,
          college: args.college,
        });
        return await newDoctor.save(); 
      },
    },
  },
});

module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation: Mutation,
});
