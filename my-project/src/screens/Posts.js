import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import React, { Component } from 'react'
import { FontAwesome } from '@expo/vector-icons'
import { auth, db } from '../firebase/config'
import firebase from 'firebase'

class Post extends Component {
    constructor(props) {
        super(props)
        this.state = {
            quantityLikes: 0,
            like: false,
            arrayLikes: [],
            arrayComments: [],
        }
    }
    componentDidMount(){
        const documento = this.props.info.data
        const likeVerification = documento.likes.includes(auth.currentUser.email)

        if (documento.likes) {
            this.setState({
              quantityLikes: documento.likes.length
            })
        }

        if (likeVerification) {
            this.setState({
              like: true
            })
        }
    }

    like(){
        const documento = this.props.info
        db.collection('posts').doc(documento.id).update({
            likes: firebase.firestore.FieldValue.arrayUnion(auth.currentUser.email)
        })
        .then(()=>{
            this.setState({
              like: true,
              quantityLikes: this.state.quantityLikes + 1
            })
        })
        .catch((error)=> console.log(error))
    }

    unlike(){
        this.setState({
          like: false,
          quantityLikes: this.state.quantityLikes - 1
        })
    }

    render() {
        const { style, info } = this.props
        return (
            <View style={styles.container}>
                <Text style={styles.text}>{info.data.description}</Text>
                <View style={styles.button}>
                    <Text>{this.state.quantityLikes}</Text>
                    {
                        this.state.like
                            ?
                            <TouchableOpacity style={styles.unlike} onPress={() => this.unlike()}>
                                <FontAwesome name='heart' size={24} color='red' />
                            </TouchableOpacity>
                            :
                            <TouchableOpacity style={styles.like} onPress={() => this.like()}>
                                <FontAwesome name='heart-o' size={24} color='black' />
                            </TouchableOpacity>
                    }
                </View>
                <TouchableOpacity style={styles.comment} onPress={()=> this.props.navigation.navigate('Comments',{id: this.props.info.id})}>
                    <Text style={styles.touchableText}>Comentar</Text>
                </TouchableOpacity>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container:{
        marginTop: 20,
        marginHorizontal:10
    },
    likes: {
        flexDirection:'row'
    },
    like:{
        marginRight:8
    },
    unlike:{
        marginRight:8
    },
    text:{
        fontSize:15,
        marginBottom:10,
    },
    button:{
        padding: 10,
        marginTop: 30,
        borderRadius: 4,
    },
    comment:{
        padding: 10,
        backgroundColor: '#dc3545',
        marginTop: 30,
        borderRadius: 4,
    },
    touchableText:{
        fontWeight: 'bold',
        color:'#fff',
        textAlign: 'center'
    }
});


export default Post