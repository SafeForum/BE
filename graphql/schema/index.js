const { buildSchema } = require("graphql");

module.exports = buildSchema(`
    type Booking {
        _id: ID!
        event: Event!
        user: User!
        createdAt: String!
        updatedAt: String!
    }

    type UserProfile {
        _id: ID!
        avatar: String
        dob: String
        city: String
        state: String
        bio: String
        occupation: String
        user: User!
        updatedAt: String
    }

    type Event {
        _id: ID!
        title: String!
        description: String!
        price: Float!
        date: String!
        creator: User!
    }
    
    type User {
        _id: ID!
        email: String!
        password: String
        createdEvents: [Event!]
        profile: UserProfile!
    }

    type AuthData {
        userId: ID!
        token: String!
        tokenExpiration: Int!
    }

    input EventInput {
        title: String!
        description: String!
        price: Float!
        date: String!
    }

    input ProfileInput {
        _id: ID!
        dob: String!
        city: String!
        state: String!
        bio: String!
        occupation: String!
    }

    input UserInput {
        email: String!
        password: String!
    }

    type RootQuery {
        user: [User!]!
        events: [Event!]!
        bookings: [Booking!]!
        login(email: String!, password: String!): AuthData!
        profile: [UserProfile!]!
    }

    type RootMutation {
        createUser(userInput: UserInput): User
        editProfile(profileInput: ProfileInput): UserProfile
        createEvent(eventInput: EventInput): Event
        bookEvent(eventId: ID!): Booking!
        cancelBooking(bookingId: ID!): Event!
        deleteUser(userId: ID!): User!
    }

    schema {
        query: RootQuery
        mutation: RootMutation
    }
`);
