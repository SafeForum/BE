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
        user: User!
        avatar: String
        bio: String
        occupation: String
        createdAt: String
        updatedAt: String
    }
        
    type User {
        _id: ID!
        email: String!
        password: String
        firstName: String!
        lastName: String!
        dob: String!
        city: String!
        state: String!
        createdEvents: [Event!]
        profile: UserProfile
    }

    type Event {
        _id: ID!
        title: String!
        description: String!
        price: Float!
        date: String!
        creator: User!
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
        avatar: String
        bio: String
        occupation: String
        createdAt: String
        updatedAt: String
    }

    input LoginInput {
        email: String!
        password: String!
    }

    input UserInput {
        email: String!
        password: String!
        firstName: String!
        lastName: String!
        dob: String!
        city: String!
        state: String!
    }

    type PortalLocation {
        city: String!
        state: String!
        users: [User!]
    }

    type RootQuery {
        getUsers: [User!]!
        events: [Event!]!
        bookings: [Booking!]!
        profile: [UserProfile!]!
    }

    type RootMutation {
        login(email: String!, password: String!): AuthData!
        createUser(userInput: UserInput, profileInput: ProfileInput): AuthData!
        editProfile(profileInput: ProfileInput, profId: ID!): UserProfile
        addProfile(profileInput: ProfileInput): UserProfile
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
