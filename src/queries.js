import {gql} from '@apollo/client';

export const GET_USER = gql`
    query($username: String) {
        user (where: {login: {_eq: $username}}){
            id
            login
        } 
    }
`

export const GET_PROGRESSES = gql`
    query ($username: String) {
        user (where: {login: {_eq: $username}}){
            progresses(limit: 50, where: {isDone: {_eq:true} , _or: [{object:{type: {_eq: "project"}}}, {object: {type: {_eq: "piscine"}}}]}) {
                isDone
                path
            }
        }
    }
`

export const GET_TRANSACTIONS = gql`
    query ($username: String) {
        user (where: {login: {_eq: $username}}){
            transactions(
                order_by:{amount: desc_nulls_last},
                limit: 50,
                where: {
                    _or: [
                        {object:{type: {_eq: "project"}}},
                        {object: {type: {_eq: "piscine"}}}
                    ],
                    type: {
                        _eq: "xp"
                    },
                },
            ) {
                amount
                createdAt
                path
                type
                object {
                    name
                    type
                }
            }
        }
    }
`