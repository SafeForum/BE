const { buildSchema } = require("graphql");

module.exports = buildSchema(`
    type Booking {
        _id: ID!
        event: Event!
        user: User!
        createdAt: String!
        updatedAt: String!
    }

    type MessageBoard {
        _id: ID!
        threads: [Thread]
        createdAt: String!
        updatedAt: String!
        cityPortal: CityPortal!
    }

    type Thread {
        _id: ID!
        messageBoard: MessageBoard!
        subject: String!
        body: String!
        creator: User!
        subscribers: [User]
        comments: [Comment]
        createdAt: String!
        updatedAt: String!
    }

    type Comment {
        _id: ID!
        comment: String!
        creator: User!
        likes: [Likes]
        createdAt: String!
        updatedAt: String!
        thread: Thread!
    }

    type Likes {
        _id: ID!
        comment: Comment!
        user: User!
        thread: Thread!
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
        cityPortal: CityPortal!
        comments: [Comment]
    }

    type CityPortal {
        _id: ID!
        city: String!
        state: String!
        users: [User!]
        messageBoard: MessageBoard!
        createdAt: String
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

    type AuthData {
        userId: ID!
        token: String!
        tokenExpiration: Int!
        cityPortal: String!
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

    input ThreadInput {
        subject: String!
        body: String!
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

    type RootQuery {
        getSingleCityPortal(portalId: String!): CityPortal!
        getMessageBoard(messageBoardId: String!): MessageBoard!
        getCityPortals: [CityPortal!]
        getUsers: [User!]!
        events: [Event!]!
        bookings: [Booking!]!
        profile: [UserProfile!]!
        getComments(threadId: String!): [Comment!]
        getThreads(messageBoardId: String!): [Thread!]
    }

    type RootMutation {
        addComment(threadId: String!, commentInput: String!, userId: String!): Comment!
        addThread(messageBoardId: String!, userId: String!, threadInput: ThreadInput!): Thread!
        addMessageBoard(portalId: String!): [MessageBoard!]
        addCityPortal(city: String!, state: String!): CityPortal!
        login(email: String!, password: String!): AuthData!
        createUser(userInput: UserInput!, profileInput: ProfileInput): AuthData!
        editProfile(profileInput: ProfileInput, profId: ID!): UserProfile
        addProfile(profileInput: ProfileInput): UserProfile
        createEvent(eventInput: EventInput): Event
        bookEvent(eventId: ID!): Booking!
        cancelBooking(bookingId: ID!): Event!
        deleteUser(userId: ID!): User!
        deleteThread(threadId: String!): Thread!
    }

    schema {
        query: RootQuery
        mutation: RootMutation
    }
`);
