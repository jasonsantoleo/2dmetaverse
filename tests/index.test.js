// i need to use axios put post delete and update 
const axios2=require('axios')

const BACKEND_URL="http://localhost:3000"

const WS_URL = "ws://localhost:3001"

const axios={
    get:async(...args)=>{
        try {
            const response=await axios2.get(...args)
            return response
        } catch (e) {
            return e.response
        }
    },
    put:async(...args)=>{
        try {
            const response=await axios2.put(...args)
            return response
        } catch (e) {
            return e.response
        }
    },
    post:async(...args)=>{
        try {
            const response=await axios2.post(...args)
            return response
        } catch (e) {
            return e.response
        }
    },
    delete:async(...args)=>{
        try {
            const response=await axios2.delete(...args)
            return response
        } catch (e) {
            return e.response
        }
    }
}
describe.skip('authentication',() => { 
    test('username is missing',async()=>{
         const username=`jason-${Math.random()}`
         const password='1234'
         const response=await axios.post(`${BACKEND_URL}/app/v1/signup`,{password:password})
         expect(response.status).toBe(400)
    })
    test('username and password is correct',async()=>{
        const username=`jason-${Math.random()}`
        const password='1234'
        await axios.post(`${BACKEND_URL}/app/v1/signup`,{username:username,password:password,type:'User'})
        const response=await axios.post(`${BACKEND_URL}/app/v1/signin`,{username:username,password:password})
        expect(response.status).toBe(200)
        expect(response.data.token).toBeDefined()
    })
    test('user signup twice at same time should fail',async()=>{
        const username=`jason-${Math.random()}`
        const password='1234'
        await axios.post(`${BACKEND_URL}/app/v1/signup`,{username:username,password:password})
        const response=await axios.post(`${BACKEND_URL}/app/v1/signup`,{username:username,password:password})
        expect(response.status).toBe(400)
    })
    test('login failed as username and password is wrong',async()=>{
        const username=`jason-${Math.random()}`
        const password='1234'
        const response=await axios.post(`${BACKEND_URL}/app/v1/signin`,{username:username,password:password})
        expect(response.status).toBe(403)
    })
 })
describe.skip('user metadata',()=>{
let token=''
let avatarId=''
beforeAll(async()=>{
    const username=`jason-${Math.random()}`
    const password='1234'
    await axios.post(`${BACKEND_URL}/app/v1/signup`,{username:username,password:password,type:'Admin'})
    const getToken=await axios.post(`${BACKEND_URL}/app/v1/signin`,{username:username,password:password})
    // console.log(getToken.data.token);
    token=getToken.data.token
    console.log(token,'Token');
    const avatarResponse=await axios.post(`${BACKEND_URL}/app/v1/admin/avatar`,{
        imageUrl:'https://wallpaperaccess.com/tommy-vercetti',
        name:'Tommy'
    },{
        headers:{
            "authorization":`bearer ${token}`
        }
    })
    // console.log(avatarResponse.data,'avatarResponse');
    
    avatarId=avatarResponse.data.avatarId
    // console.log(avatarId,'avatarId');

})
test('user cant update metaData with wrong avatarId',async()=>{
    console.log(token);
    
    const response=await axios.post(`${BACKEND_URL}/app/v1/user/metadata`,{
        avatarId:'124123'
    },{
        headers:{
            'authorization':`bearer ${token}`
        }
    })
    expect(response.status).toBe(400)
})
test('can change if avatar id is given ',async ()=>{
    // console.log(avatarId,'avatarId');
    // console.log(token,'token');
    
    const response=await axios.post(`${BACKEND_URL}/app/v1/user/metadata`,{
        avatarId:avatarId
    },{
        headers:{
            authorization:`bearer ${token}`
        }
    })
    expect(response.status).toBe(200)
})
test('cant update if token is not defined',async()=>{
    const response=await axios.post(`${BACKEND_URL}/app/v1/user/metadata`,{
        avatarId:avatarId
    })
    expect(response.status).toBe(403)
})
})
describe.skip('avatar information',()=>{
    let avatarId=''
    let userId=''
    let token=''
    beforeAll(async()=>{
        const username=`jason-${Math.random()}`
        const password='1234'
        const getUserId=await axios.post(`${BACKEND_URL}/app/v1/signup`,{username:username,password:password,type:'User'})
        userId=getUserId.data.userId
        // console.log(userId,'userId');
        const getToken=await axios.post(`${BACKEND_URL}/app/v1/signin`,{username:username,password:password})
        token=getToken.data.token
        // console.log(token,'token');
        const avatarResponse=await axios.post(`${BACKEND_URL}/app/v1/admin/avatar`,{
            imageUrl:'https://wallpaperaccess.com/tommy-vercetti',
            name:'Tommy'
        },{
            headers:{
                'authorization':`bearer ${token}`
            }
        })
        avatarId=avatarResponse.data.avatarId
        // console.log(avatarId,'avatarId');
        
    })
    test('user able to get recently created avatar',async ()=>{
        const response=await axios.get(`${BACKEND_URL}/app/v1/avatar`)
        console.log(response.data.avatars[0].id,'response');
        expect(response.data.avatars.length).not.toBe(1)
        const currentAvatar=response.data.avatars.find(x=> x.id===avatarId)
        expect(currentAvatar).toBeDefined()
    })
    test('Get back avatar information for the user',async()=>{
        const response=await axios.get(`${BACKEND_URL}/app/v1/user/metadata/bulk?ids=[${userId}]`)
        console.log(JSON.stringify(response.data),'log');
        expect(response.data.avatar.length).not.toBe(0)
        expect(response.data.avatar[0].userId).toBe(userId)
    })
})
describe.skip('space information', () => { 
    let userId=''
    let userToken=''
    let adminId=''
    let adminToken=''
    let mapId=''
    let elementId1=''
    let elementId2=''
    beforeAll(async ()=>{
        const username=`jason-${Math.random()}`
        const password='1234'
        const adminUsername=`jason-${Math.random()}`
        const adminPassword='1234'
        const userSignUp=await axios.post(`${BACKEND_URL}/app/v1/signup`,{
            username:username,
            password:password,
            type:"User"
        })
        // console.log(userSignUp.data,'userId'); 
        userId=userSignUp.data.userId
        // console.log(userId,'userId');
        
        const userSignIn=await axios.post(`${BACKEND_URL}/app/v1/signin`,{
            username:username,
            password:password
        })
        userToken=userSignIn.data.token
        // console.log(userToken,'token');
        
        const adminSignUp=await axios.post(`${BACKEND_URL}/app/v1/signup`,{
            username:adminUsername,
            password:adminPassword,
            type:'Admin'
        })
        adminId=adminSignUp.data.userId
        // console.log(adminId,'adminId');
        
        const adminSignIn=await axios.post(`${BACKEND_URL}/app/v1/signin`,{
            username:adminUsername,
            password:adminPassword
        })
        adminToken=adminSignIn.data.token
        // console.log(adminToken,'adminToken');
        const elementIdResponse1=await axios.post(`${BACKEND_URL}/app/v1/admin/element`,{
            "imageUrl":"https://wallpaperaccess.com/tommy-vercetti",
            "width":1,
            "height":1,
            "static":true
        },{
            headers:{
                authorization:`Bearer ${adminToken}`
            }
        })
        elementId1=elementIdResponse1.data.id
        // console.log(elementId1,'element1');
        
        const elementIdResponse2=await axios.post(`${BACKEND_URL}/app/v1/admin/element`,{
            "imageUrl":"https://wallpaperaccess.com/tommy-vercetti",
            "width":1,
            "height":1,
            "static":true
        },{
            headers:{
                authorization:`Bearer ${adminToken}`
            }
        })
        elementId2= elementIdResponse2.data.id
        // console.log(elementId2,'element2');
        const Map=await axios.post(`${BACKEND_URL}/app/v1/admin/map`,{
            "thumbnail": "https://thumbnail.com/a.png",
            "dimension": "100x200",
            "name": "100 person interview room",
            "defaultElements": [{
                    elementId:elementId1,
                    x: 20,
                    y: 20
                }, {
                    elementId: elementId2,
                    x: 18,
                    y: 20
                }
            ]
            
        },{
            headers:{
                authorization:`Bearer ${adminToken}`
            }
        })
        mapId=Map.data.mapId
        // console.log(mapId); 
    })
    test('successful space creation',async ()=>{
        const mapResponse=await axios.post(`${BACKEND_URL}/app/v1/space`,{
            "name":"jason",
            "dimension":"100x200",
            "mapId":mapId
        },{
            headers:{
                'authorization': `Bearer ${userToken}`
            }
        })
        // console.log(mapResponse.data);
        expect(mapResponse.status).toBe(200)
        expect(mapResponse.data.spaceId).toBeDefined()
    })
    test('cant log in without dimension',async()=>{
        const mapResponse=await axios.post(`${BACKEND_URL}/app/v1/space`,{
            "name":"jason",
            "mapId":"123"
        },{
            headers:{
                "authorization": `Bearer ${userToken}`
            }
        })
        expect(mapResponse.status).toBe(400)
    })
    test('user is able to create a space without mapId ',async()=>{
        const mapResponse=await axios.post(`${BACKEND_URL}/app/v1/space`,{
            "name":"jason",
            "dimension":"100x200",
        },{
            headers:{
                "authorization": `Bearer ${userToken}`
            }
        })
        // console.log(mapResponse.data,'mapresponse');
        expect(mapResponse.status).toBe(200)
    })
    test('can not delete space created by another user ',async()=>{
        const mapResponse1=await axios.post(`${BACKEND_URL}/app/v1/space`,{
            "name":"test",
            "dimension":"100x200",
        },{
            headers:{
                "authorization": `Bearer ${userToken}`
            }
        })
        // console.log(mapResponse1.data,'spaceId');
        
        const mapResponse2=await axios.delete(`${BACKEND_URL}/app/v1/space/${mapResponse1.data.spaceId}`,{
            id:mapResponse1.data.spaceId
        },{
            headers:{
                authorization: `Bearer ${adminToken}`
            }
        })
        expect(mapResponse2.status).toBe(403)
    })
    test('admin has no space initially',async()=>{
        const mapResponse=await axios.get(`${BACKEND_URL}/app/v1/space/all`,{
            headers:{
                "authorization": `Bearer ${adminToken}`
            }
        })
        console.log(mapResponse.data);
        
        expect(mapResponse.data.spaces.length).toBe(0)
    })
    test('admin gets one space',async()=>{
        const mapResponse1=await axios.post(`${BACKEND_URL}/app/v1/space`,{
            "name":"test",
            "dimension":"100x200",
        },{
            headers:{
                "authorization": `Bearer ${adminToken}`
            }
        })
        const mapResponse2=await axios.get(`${BACKEND_URL}/app/v1/space/all`,{
            headers:{
                authorization: `Bearer ${adminToken}`
            }
        })
        expect(mapResponse2.data.spaces.length).toBe(1)
    })
})
describe.skip('arena endpoint',()=>{
    let mapId=''
    let element1=''
    let element2=''
    let adminId=''
    let adminToken=''
    let userId=''
    let userToken=''
    let spaceId=''

    beforeAll(async()=>{
        const username=`jason-${Math.random()}`
        const password='1234'

        const signUp=await axios.post(`${BACKEND_URL}/app/v1/signup`,{
            username:username,
            password:password,
            type:'User'
        })
        userId=signUp.data.userId
        const signIn=await axios.post(`${BACKEND_URL}/app/v1/signin`,{
            username,
            password
        })
        userToken=signIn.data.token
        // console.log(userId,userToken,'userId');
        const adminName=`jason-${Math.random()}`
        const adminPassword=`1234`
        const adminSignUp=await axios.post(`${BACKEND_URL}/app/v1/signup`,{
            username:adminName,
            password:adminPassword,
            type:'Admin'
        })
        adminId=adminSignUp.data.userId
        const adminSignIn=await axios.post(`${BACKEND_URL}/app/v1/signin`,{
            username:adminName,
            password:adminPassword
        })
        adminToken=adminSignIn.data.token
        // console.log(adminToken,adminSignUp.data,'admin login ');

        const element1Response=await axios.post(`${BACKEND_URL}/app/v1/admin/element`,{
            "imageUrl":'https://wallpaperaccess.com/tommy-vercetti',
            "width":1,
            "height":2,
            "static":true
        },{
            headers:{
                "authorization":`Bearer ${adminToken}`
            }
        })
        element1=element1Response.data.id
        
        const element2Response=await axios.post(`${BACKEND_URL}/app/v1/admin/element`,{
            "imageUrl":'https://wallpaperaccess.com/tommy-vercetti',
            "width":1,
            "height":2,
            "static":true
        },{
            headers:{
                "authorization":`Bearer ${adminToken}`
            }
        })
        element2=element2Response.data.id
        // console.log(element2,'elementIde');
        const mapResponse=await axios.post(`${BACKEND_URL}/app/v1/admin/map`,{
                "thumbnail": "https://thumbnail.com/a.png",
                "dimension": "100x200",
                "name": "100 person interview room",
                "defaultElements": [{
                        elementId: element1,
                        x: 20,
                        y: 20
                    }, {
                      elementId: element2,
                        x: 18,
                        y: 20
                    },
                ]
        },{
            headers:{
                "authorization":`Bearer ${adminToken}`
            }
        })
        mapId=mapResponse.data.mapId
        // console.log(mapId,'mapId');
        const spaceResponse=await axios.post(`${BACKEND_URL}/app/v1/space`,{
            "name":"test",
            "dimension":"100x200",
            "mapId":mapId
        },{
            headers:{
                "authorization":`Bearer ${userToken}`
            }
        })
        // console.log(spaceResponse.data.spaceId,"spaceId");
        spaceId=spaceResponse.data.spaceId
    })

    test('wrong space id returns 400',async()=>{
        const getSpace=await axios.get(`${BACKEND_URL}/app/v1/space/${123}`,{
            headers:{
                "authorization":`Bearer ${userToken}`
            }
        })
        // console.log(getSpace.data);
        expect(getSpace.status).toBe(400)
    })
    test('correct spaceId returns space elements',async()=>{
        const getSpace=await axios.get(`${BACKEND_URL}/app/v1/space/${spaceId}`,{
            headers:{
                "authorization":`Bearer ${userToken}`
            }
        })
        // console.log(getSpace.data,'getSpace');
        
        expect(getSpace.data.elements.length).toBe(2)
        expect(getSpace.status).toBe(200)
    })
    test('delete endpoint is able to delete an element',async()=>{
        console.log(spaceId,'spaceId');
        
        const getResponse1=await axios.get(`${BACKEND_URL}/app/v1/space/${spaceId}`,{
            headers:{
                "authorization":`Bearer ${userToken}`
            }
        })
        const x=getResponse1.data.elements.length
        console.log(getResponse1.data);
        // console.log(userToken,'userToken');
        let deleteElement=await axios.delete(`${BACKEND_URL}/app/v1/space/element`,{
            data:{id:getResponse1.data.elements[0].id},
            headers:{"authorization":`Bearer ${userToken}`}
        })
        console.log(deleteElement.data,'delete element');
        
        const getResponse2=await axios.get(`${BACKEND_URL}/app/v1/space/${spaceId}`,{
            headers:{
                "authorization":`Bearer ${userToken}`
            }
        })
        // console.log(getResponse2.data);
        // console.log(getResponse2.data.elements.length,x-1);
        expect(getResponse2.data.elements.length).toBe(x-1)
    })
    test('adding element fails if it outside the dimension',async()=>{
        const addResponse=await axios.post('api/v1/space/element',
            {
                "elementId": "chair1",
                "spaceId": "123",
                "x": 50,
                "y": 20
            },{
                headers:{
                    authorization:`Bearer ${userToken}`
                }
            }
        )
    })
    test('adding elemnet works as expected',async()=>{
        const addElementResponse=await axios.post(`${BACKEND_URL}/app/v1/space/element`,{
            "elementId":element1,
            "spaceId":spaceId,
            "x":20,
            "y":10
        },{
            headers:{
                authorization:`Bearer ${userToken}`
            }
        })
        console.log(addElementResponse.data);
        const getElement=await axios.get(`${BACKEND_URL}/app/v1/space/${spaceId}`,{
            headers:{
                authorization:`Bearer ${userToken}`
            }
        })
        // console.log(getElement.data.elements.);
        expect(getElement.data.elements.length).toBe(2)
    })
})
// describe('websocket',()=>{
//     let adminId=''
//     let adminToken=''
//     let userId=''
//     let userToken=''
//     let element1=''
//     let element2=''
//     let mapId=''
//     let spaceId=''
//     let ws1Messages = []
//     let ws2Messages = []
//     let adminX=''
//     let adminY='' 
//     let userX=''
//     let userY=''
//     let ws1;
//     let ws2;
//     async function waitForAndPopLatestElement(messageQueue) {
//         return promise(()=>{
//             if (messageQueue.length>0){
//                 resolve(messageQueue.shift())
//             }else{
//                 let interval=setInterval(()=>{
//                     if (messageQueue.length>0){
//                         resolve(messageQueue.shift())
//                         clearInterval(interval)
//                     }
//                 },100)
//             }
//         })
//     }
//     async function setupHttp(){
//         const username=`jason-${Math.random()}`
//         const password='1234'
//         const adminUsername=`jason-${Math.random()}`
//         const adminPassword='1234'
//         const userSignUp=await axios.post(`${BACKEND_URL}/app/v1/signup`,{
//             username:username,
//             password:password,
//             type:'User'
//         })
//         // console.log(userSignUp.data,'user sign up');
//         userId=userSignUp.data.userId
        
//         const userSignIn=await axios.post(`${BACKEND_URL}/app/v1/signin`,{
//             username:username,
//             password:password
//         })
//         userToken=userSignIn.data.token
//         // console.log(userSignIn.data,'user sign in data ');
        
//         const adminSignUp=await axios.post(`${BACKEND_URL}/app/v1/signup`,{
//             username:adminUsername,
//             password:adminPassword,
//             type:'Admin'
//         })
//         adminId=adminSignUp.data.adminId
//         const adminSignIn=await axios.post(`${BACKEND_URL}/app/v1/signin`,{
//             username:adminUsername,
//             password:adminPassword
//         })
//         adminToken=adminSignIn.data.token
//         // console.log(adminSignIn.data,adminSignUp.data,'admin');

//         const element1Response=await axios.post(`${BACKEND_URL}/app/v1/admin/element`,{
//             "imageUrl": "https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcRCRca3wAR4zjPPTzeIY9rSwbbqB6bB2hVkoTXN4eerXOIkJTG1GpZ9ZqSGYafQPToWy_JTcmV5RHXsAsWQC3tKnMlH_CsibsSZ5oJtbakq&usqp=CAE",
//             "width": 1,
//             "height": 1,
//             "static": true 
//         },{
//             headers:{
//                 "authorization":`Bearer ${adminToken}`
//             }
//         })
//         // console.log(element1Response.data,'element1');
        
//         const element2Response=await axios.post(`${BACKEND_URL}/app/v1/admin/element`,{
//             "imageUrl": "https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcRCRca3wAR4zjPPTzeIY9rSwbbqB6bB2hVkoTXN4eerXOIkJTG1GpZ9ZqSGYafQPToWy_JTcmV5RHXsAsWQC3tKnMlH_CsibsSZ5oJtbakq&usqp=CAE",
//             "width": 1,
//             "height": 1,
//             "static": true 
//         },{
//             headers:{
//                 "authorization":`Bearer ${adminToken}`
//             }
//         })
//         // console.log(element2Response.data,'element two response ');
        
//         element1=element1Response.data.id
//         element2=element2Response.data.id
//         const mapResponse=await axios.post(`${BACKEND_URL}/app/v1/admin/map`,{
//                 "thumbnail": "https://thumbnail.com/a.png",
//                 "dimension": "100x200",
//                 "name": "100 person interview room",
//                 "defaultElements": [{
//                         elementId: element1,
//                         x: 20,
//                         y: 20
//                     }, {
//                       elementId: element2,
//                         x: 18,
//                         y: 20
//                     }
//                 ]
//         },{
//             headers:{
//                 authorization:`Bearer ${adminToken}`
//             }
//         })
//         // console.log(mapResponse.data,'map response');
//         mapId=mapResponse.data.id
//         const spaceResponse=await axios.post(`${BACKEND_URL}/app/v1/space`,{
//             "name": "Test",
//             "dimension": "100x200",
//             "mapId": mapId
//        },{
//         headers:{
//             "authorization":`Bearer ${userToken}`
//         }
//        })
//     //    console.log(spaceResponse.data);
//        spaceId=spaceResponse.data.spaceId 
//     }
//     async function setupWs(){
//         ws1=new WebSocket(WS_URL)

//         ws1.onmessage=(event)=>{
//             console.log('event got from 1');
//             console.log(event.data);
//             ws1Messages.push(JSON.parse(event.data))
//         }

//         await new Promise(e=>{
//             ws1.onopen=e
//         })

//         ws2=new WebSocket(WS_URL)

//         w2.onmessage=(event)=>{
//             console.log('event got from 2');
//             console.log(event.data);
//             ws2Messages.push(JSON.parse(event.data))
//         }
        
//         await new Promise(r=>{
//             ws2.onopen=r
//         })
//     }
//     beforeAll(async ()=>{
//         await setupHttp();
//         await setupWs()
//     })
//     test('sending back ack ones joined',async()=>{
//         console.log('first test');
//         ws1.send(JSON.stringify({
//             "type":"join",
//             payload:{
//                 "spaceId":spaceId,
//                 "token":adminToken
//             }
//         }))
//         console.log('first test2');
//         const message1=await waitForAndPopLatestElement(ws1Messages)
//         w2.send(JSON.stringify({
//             'type':'join',
//             'payload':{
//                 'spaceId':spaceId,
//                 'token':userToken
//             }
//         }))
//         console.log('first test3');
//         const message2=await waitForAndPopLatestElement(ws2Messages)
//         const message3=await waitForAndPopLatestElement(ws1Messages)

//         expect(message1.type).toBe('space-joined')
//         expect(message2.type).toBe('space-joined')
//         expect(message1.users.length).toBe(0)
//         expect(message2.users.length).toBe(1)
//         expect(message3.type).toBe('user-joined')
//         expect(message3.payload.x).toBe(message2.payload.spawn.x)
//         expect(message3.payload.y).toBe(message2.payload.spawn.y)
//         adminX=message3.payload.spawn.x
//         adminY=message3.payload.spawn.y
//         userX=message2.payload.spawn.x
//         userY=message2.payload.spawn.y
//     })
    // test('user should not be able to move across boundary',async()=>{
    //     ws1.send(JSON.stringify({
    //         "type":'move',
    //         payload:{
    //             x:10000,
    //             y:10
    //         }
    //     }))
    //     const message1=await waitForAndPopLatestElement(ws1Messages)
    //     expect(message1.type).toBe('movement-rejected')
    //     expect(message1.payload.x).toBe(adminX)
    //     expect(message1.payload.y).toBe(adminY)
    // })
    // test('if one user leave other get message user-left',async()=>{
    //     ws2.close()
    //     const w1=await waitForAndPopLatestElement(ws2Messages)
    //     expect(w1).toBe('user-left')
    //     expect(message.payload.userId).toBe(adminId)
    // })
// })