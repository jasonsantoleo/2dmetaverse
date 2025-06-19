// i need to use axios put post delete and update 
const axios2=require('axios')
const { resolve } = require('path')

const BACKEND_URL="http://localhost:3000"

const WS_URL = "ws://localhost:3001"

const axios={
    get:(...args)=>{
        try {
            const response=axios.get(...args)
            return response
        } catch (e) {
            return e.response
        }
    },
    put:(...args)=>{
        try {
            const response=axios.get(...args)
            return response
        } catch (e) {
            return e.response
        }
    },
    post:(...args)=>{
        try {
            const response=axios.get(...args)
            return response
        } catch (e) {
            return e.response
        }
    },
    delete:(...args)=>{
        try {
            const response=axios.get(...args)
            return response
        } catch (e) {
            return e.response
        }
    }
}
describe('authentication', async() => { 
    test('username is missing',()=>{
         const username=`jason-${Math.random()}`
         const password='1234'
         const response=axios.post(`${BACKEND_URL}/api/v1/signup`,{password:password})
         expect(response.status).toBe(400)
    })
    test('username and password is correct',async()=>{
        const username=`jason-${Math.random()}`
        const password='1234'
        await axios.post(`${BACKEND_URL}/api/v1/signup`,{username:username,password:password})
        const response=axios.post(`${BACKEND_URL}/api/v1/signin`,{username:username,password:password})
        expect(response.status).toBe(200)
        expect(response.token).toBeDefined()
    })
    test('user signup twice at same time should fail',async()=>{
        const username=`jason-${Math.random()}`
        const password='1234'
        await axios.post(`${BACKEND_URL}/api/v1/signup`,{username:username,password:password})
        const response=await axios.post(`${BACKEND_URL}/api/v1/signup`,{username:username,password:password})
        expect(response.status).toBe(400)
    })
    test('login failed as username and password is wrong',async()=>{
        const username=`jason-${Math.random()}`
        const password='1234'
        const response=await axios.post(`${BACKEND_URL}/api/v1/signin`,{username:username,password:password})
        expect(response).toBe(403)
    })
 })
describe('user metadata',()=>{
const token=''
const avatarId=''
beforeAll(async()=>{
    const username=`jason-${Math.random()}`
    const password='1234'
    await axios.post(`${BACKEND_URL}/api/v1/signup`,{username:username,password:password})
    const getToken=await axios.post(`${BACKEND_URL}/api/v1/signin`,{username:username,password:password})
    token=getToken.data.token
    const avatarResponse=await axios.post(`${BACKEND_URL}/api/v1/avatar`,{
        imageURL:'https://wallpaperaccess.com/tommy-vercetti',
        name:'Tommy'
    },{
        headers:{
            authorization:`bearer ${getToken}`
        }
    })
    avatarId=avatarResponse.data.avatarId
})
test('user cant update metaData with wrong avatarId',async()=>{
    const response=await axios.post(`${BACKEND_URL}/api/v1/avatar`,{
        avatarId:'124123'
    },{
        headers:{
            authorization:`bearer ${token}`
        }
    })
    expect(response).toBe(400)
})
test('can change if avatar id is given ',async ()=>{
    const response=await axios.post(`${BACKEND_URL}/api/v1/avatar`,{
        avatarId:avatarId
    },{
        headers:{
            authorization:`bearer ${token}`
        }
    })
    expect(response).toBe(200)
})
test('cant update if token is not defined',async()=>{
    const response=await axios.post(`${BACKEND_URL}/api/v1/avatar`,{
        avatarId:avatarId
    },{
        headers:{
            authorization:`bearer ${token}`
        }
    })
    expect(response).toBe(200)
})
})
describe('avatar information',async()=>{
    const avatarId=''
    const userId=''
    const token=''
    beforeAll(async()=>{
        const username=`jason-${Math.random()}`
        const password='1234'
        const getUserId=await axios.post(`${BACKEND_URL}/api/v1/signup`,{username:username,password:password})
        userId=getUserId.data.userId
        const getToken=await axios.post(`${BACKEND_URL}/api/v1/signin`,{username:username,password:password})
        token=getToken.data.token
        const avatarResponse=await axios.post(`${BACKEND_URL}/api/v1/admin/avatar`,{
            imageURL:'https://wallpaperaccess.com/tommy-vercetti',
            name:'Tommy'
        },{
            headers:{
                authorization:`bearer ${getToken}`
            }
        })
        avatarId=avatarResponse.data.avatarId
    })
    test('user able to get a avatar information',async ()=>{
        const response=await axios.get(`${BACKEND_URL}/api/v1/user/avatar/bulk?ids=${userId}`)
        expect(response.data.avatar.length).toBe(1)
    })
    test('available avatars,recently created avatar',async()=>{
        const response=await axios.get(`${BACKEND_URL}/api/v1/user/avatars`)
        expect(response.data.avatars.length).not.toBe(0)
        const currentAvatar=response.data.avatar.find(x=> x.id===avatarId)
        expect(currentAvatar).toBeDefined
    })
})
describe('space information',async () => { 
    const userId=''
    const userToken=''
    const adminId=''
    const adminToken=''
    const mapId=''
    const elementId1=''
    const elementId2=''
    beforeAll(async ()=>{
        const username=`jason-${Math.random()}`
        const password='1234'
        const userSignUp=await axios.post(`${BACKEND_URL}/api/v1/signup`,{
            username:username,
            password:password
        })
        userId=userSignUp.data.userId
        const userSignIn=await axios.post(`${BACKEND_URL}/api/v1/signup`,{
            username:username,
            password:password
        })
        userToken=userSignIn.data.token
        const adminSignUp=await axios.post(`${BACKEND_URL}/api/v1/signup`,{
            username:username,
            password:password
        })
        adminId=adminSignUp.data.userId
        const adminSignIn=await axios.post(`${BACKEND_URL}/api/v1/signup`,{
            username:username,
            password:password
        })
        adminToken=adminSignIn.data.token
        const elementIdResponse1=await axios.post(`${BACKEND_URL}/api/v1/admin/element`,{
            "image":"https://wallpaperaccess.com/tommy-vercetti",
            "width":1,
            "height":1,
            "static":true
        },{
            headers:{
                authorization:`Bearer ${adminToken}`
            }
        })
        elementId1=elementIdResponse1.data
        const elementIdResponse2=await axios.post(`${BACKEND_URL}/api/v1/admin/element`,{
            "image":"https://wallpaperaccess.com/tommy-vercetti",
            "width":1,
            "height":1,
            "static":true
        },{
            headers:{
                authorization:`Bearer ${adminToken}`
            }
        })
        elementId2= elementIdResponse1.data
        const Map=await axios.post(`${BACKEND_URL}/api/v1/admin/map`,{
            "thumbnail": "https://thumbnail.com/a.png",
            "dimensions": "100x200",
            "name": "100 person interview room",
            "defaultElements": [{
                    elementId:elementId1.id,
                    x: 20,
                    y: 20
                }, {
                    elementId: elementId2.id,
                    x: 18,
                    y: 20
                }
            ]
            
        },{
            headers:{
                authorization:`Bearer ${adminToken}`
            }
        })
        mapId=Map.data
    })
    test('successful map creation',async ()=>{
        const mapResponse=await axios.post(`${BACKEND_URL}/api/v1/space`,{
            "name":"jason",
            "dimension":"100x200",
            "mapId":"123"
        },{
            headers:{
                authorization: `Bearer ${mapResponse.data.token}`
            }
        })
        expect(mapResponse.data.token).toBe(200)
        expect(mapResponse.data.spaceId).toBeDefined()
    })
    test('cant log in without dimension',async()=>{
        const mapResponse=await axios.post(`${BACKEND_URL}/api/v1/space`,{
            "name":"jason",
            "mapId":"123"
        },{
            headers:{
                authorization: `Bearer ${mapResponse.data.token}`
            }
        })
        expect(mapResponse.status).toBe(400)
    })
    test('cant log in without mapId',async()=>{
        const mapResponse=await axios.post(`${BACKEND_URL}/api/v1/space`,{
            "name":"jason",
            "dimension":"100x200",
        },{
            headers:{
                authorization: `Bearer ${userToken}`
            }
        })
        expect(mapResponse.status).toBe(400)
    })
    test('can not delete space created by another user ',async()=>{
        const mapResponse1=await axios.post(`${BACKEND_URL}/api/v1/space`,{
            "name":"test",
            "dimension":"100x200",
        },{
            headers:{
                authorization: `Bearer ${userToken}`
            }
        })
        const mapResponse2=await axios.delete(`${BACKEND_URL}/api/v1/space`,{
            "name":"test",
            "dimension":"100x200",
        },{
            headers:{
                authorization: `Bearer ${adminToken}`
            }
        })
        expect(mapResponse2).toBe(403)
    })
    test('admin has no space initially',async()=>{
        const mapResponse=await axios.get(`${BACKEND_URL}/api/v1/space/all`,{
            headers:{
                authorization: `Bearer ${adminToken}`
            }
        })
        expect(mapResponse.data.spaces.length).toBe(0)
    })
    test('admin gets one space',async()=>{
        const mapResponse1=await axios.post(`${BACKEND_URL}/api/v1/space`,{
            "name":"test",
            "dimension":"100x200",
        },{
            headers:{
                authorization: `Bearer ${adminToken}`
            }
        })
        const mapResponse2=await axios.get(`${BACKEND_URL}/api/v1/space/all`,{
            headers:{
                authorization: `Bearer ${adminToken}`
            }
        })
        expect(mapResponse2.data.spaces.length).toBe(1)
    })
})
describe('arena endpoint',async()=>{
    const mapId=''
    const element1=''
    const element2=''
    const adminId=''
    const adminToken=''
    const userId=''
    const userToken=''
    const spaceId=''

    beforeAll(async()=>{
        const username=`jason-${Math.random()}`
        const password='1234'

        const signUp=await axios.post(`${BACKEND_URL}/api/v2/signUp`,{
            username:username,
            password:password,
        })
        userId=signUp.data.userId
        const signIn=await axios.post(`${BACKEND_URL}/api/v1/signin`,{
            username,
            password
        })
        userToken=signIn.data.token
        const element1Response=await axios.post(`${BACKEND_URL}/api/v1/admin/element`,{
            "imageUrl":'https://wallpaperaccess.com/tommy-vercetti',
            "width":1,
            "height":2,
            "static":true
        },{
            headers:{
                authentication:`Bearer ${adminToken}`
            }
        })
        element1=element1Response.data.id
        const element2Response=await axios.post(`${BACKEND_URL}/api/v1/admin/element`,{
            "imageUrl":'https://wallpaperaccess.com/tommy-vercetti',
            "width":1,
            "height":2,
            "static":true
        },{
            headers:{
                authentication:`Bearer ${adminToken}`
            }
        })
        element2=element2Response.data.id
        const mapResponse=await axios.post(`${BACKEND_URL}/api/v1/admin/map`,{
                "thumbnail": "https://thumbnail.com/a.png",
                "dimensions": "100x200",
                "name": "100 person interview room",
                "defaultElements": [{
                        elementId: "chair1",
                        x: 20,
                        y: 20
                    }, {
                      elementId: "chair2",
                        x: 18,
                        y: 20
                    },
                ]
        },{
            headers:{
                authentication:`Bearer ${adminToken}`
            }
        })
        mapId=mapResponse.data.id
        const spaceResponse=await axios.post(`${BACKEND_URL}/api/v1/space`,{
            "name":"test",
            "dimensioni":"100x200",
            "mapId":"123"
        },{
            headers:{
                authentication:`Bearer ${userToken}`
            }
        })
        spaceId=spaceId.data.id
    })

    test('wrong space id returns 400',async()=>{
        const getSpace=await axios.get(`${BACKEND_URL}/api/v1/space/18273`,{
            headers:{
                authentication:`Bearer ${userToken}`
            }
        })
        expect(getSpace.data.status).toBe(400)
    })
    test('correct spaceId returns space elements',async()=>{
        const getSpace=await axios.get(`${BACKEND_URL}/api/v1/space/${spaceId}`,{
            headers:{
                authentication:`Bearer ${userToken}`
            }
        })
        expect(getSpace.data.status).toBe(200)
    })
    test('successful deletion',async()=>{
        const getResponse1=await axios.get(`${BACKEND_URL}/api/v1/space/${spaceId}`,{
            headers:{
                authentication:`Bearer ${userToken}`
            }
        })
        const x=getResponse1.data.elements.length
        const deleteElement=await axios.delete(`${BACKEND_URL}/api/v1/space`,{
            id:getResponse1.data.id
        })
        const getResponse2=await axios.get(`${BACKEND_URL}/api/v1/space/${spaceId}`,{
            headers:{
                authentication:`Bearer ${userToken}`
            }
        })
        expect(deleteElement).toBe(getResponse2.data.elements.length===x-1)
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
        const addElementResponse=await axios.post(`${BACKEND_URL}/api/v1/space/element`,{
            "elementId":element1,
            x:20,
            y:10
        },{
            headers:{
                authorization:`Bearer ${userToken}`
            }
        })
        const getElement=await axios.get(`${BACKEND_URL}/api/v1/space`,{
            headers:{
                authorization:`Bearer ${userToken}`
            }
        })
        expect(getElement.data.elements.length).toBe(3)
    })
})
describe('websocket',()=>{
    const adminId=''
    const adminToken=''
    const userId=''
    const userToken=''
    const element1=''
    const element2=''
    const mapId=''
    const spaceId=''
    let ws1Messages = []
    let ws2Messages = []
    const adminX=''
    const adminY='' 
    const userX=''
    const userY=''
    async function waitForAndPopLatestElement(messageQueue) {
        return promise(()=>{
            if (messageQueue.length>0){
                resolve(messageQueue.shift())
            }else{
                let interval=setInterval(()=>{
                    if (messageQueue.length>0){
                        resolve(messageQueue.shift())
                        clearInterval(interval)
                    }
                },100)
            }
        })
    }
    async function setupHttp(){
        const username=`jason-${Math.random()}`
        const password='1234'
        const userSignUp=await axios.post(`${BACKEND_URL}/api/v1/signup`,{
            username:username,
            password:password
        })
        userId=userSignIn.data.userId
        const userSignIn=await axios.post(`${BACKEND_URL}/api/v1/signin`,{
            username:username,
            password:password
        })
        userToken=userSignIn.data.token
        const adminSignUp=await axios.post(`${BACKEND_URL}/api/v1/signup`,{
            username:username,
            password:password,
            type:'admin'
        })
        adminId=adminSignUp.data.adminId
        const adminSignIn=await axios.post(`${BACKEND_URL}/api/v1/signin`,{
            username:username,
            password:password
        })
        adminToken=adminSignIn.data.token

        const element1Response=axios.post(`${BACKEND_URL}/api/v1/element`,{
            "imageUrl": "https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcRCRca3wAR4zjPPTzeIY9rSwbbqB6bB2hVkoTXN4eerXOIkJTG1GpZ9ZqSGYafQPToWy_JTcmV5RHXsAsWQC3tKnMlH_CsibsSZ5oJtbakq&usqp=CAE",
            "width": 1,
            "height": 1,
            "static": true 
        },{
            headers:{
                authorization:`Bearer ${adminToken}`
            }
        })
        const element2Response=axios.post(`${BACKEND_URL}/api/v1/element`,{
            "imageUrl": "https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcRCRca3wAR4zjPPTzeIY9rSwbbqB6bB2hVkoTXN4eerXOIkJTG1GpZ9ZqSGYafQPToWy_JTcmV5RHXsAsWQC3tKnMlH_CsibsSZ5oJtbakq&usqp=CAE",
            "width": 1,
            "height": 1,
            "static": true 
        })
        element1=element1Response.data.id
        element2=element2Response.data.id
        const mapResponse=await axios.post(`${BACKEND_URL}/api/v1/map`,{
                "thumbnail": "https://thumbnail.com/a.png",
                "dimensions": "100x200",
                "name": "100 person interview room",
                "defaultElements": [{
                        elementId: element1,
                        x: 20,
                        y: 20
                    }, {
                      elementId: element2,
                        x: 18,
                        y: 20
                    }
                ]
        },{
            headers:{
                authorization:`Bearer ${adminToken}`
            }
        })
        const mapId=mapResponse.data.id
        const spaceResponse=await axios.post(`${BACKEND_URL}/api/v1/space`,{
            "name": "Test",
            "dimensions": "100x200",
            "mapId": "map1"
       })
       spaceId=spaceResponse.data.spaceId 
    }
    async function setupWs(){
        const ws1=new websocket(WS_URL)

        ws1.onmessage=(event)=>{
            console.log('event got from 1');
            console.log(event.data);
            ws1Messages.push(JSON.parse(event.data))
        }

        await new promise(e=>{
            ws1.open=e
        })

        const ws2=new websocket(WS_URL)

        w2.onmessage=(event)=>{
            console.log('event got from 2');
            console.log(event.data);
            ws2Messages.push(JSON.parse(event.data))
        }
        
        await new promise(r=>{
            ws2.open=r
        })
    }
    beforeAll(()=>{
        setupHttp();
        setupWs()
    })
    test('sending back ack ones joined',async()=>{
        console.log('first test');
        ws1.send(JSON.stringify({
            "type":"join",
            payload:{
                "spaceId":spaceId,
                "token":adminToken
            }
        }))
        console.log('first test2');
        const message1=await waitForAndPopLatestElement(ws1Messages)
        w2.send(JSON.stringify({
            'type':'join',
            'payload':{
                'spaceId':spaceId,
                'token':userToken
            }
        }))
        console.log('first test3');
        const message2=await waitForAndPopLatestElement(ws2Messages)
        const message3=await waitForAndPopLatestElement(ws1Messages)

        expect(message1.type).toBe('space-joined')
        expect(message2.type).toBe('space-joined')
        expect(message1.users.length).toBe(0)
        expect(message2.users.length).toBe(1)
        expect(message3.type).toBe('user-joined')
        expect(message3.payload.x).toBe(message2.payload.spawn.x)
        expect(message3.payload.y).toBe(message2.payload.spawn.y)
        adminX=message3.payload.spawn.x
        adminY=message3.payload.spawn.y
        userX=message2.payload.spawn.x
        userY=message2.payload.spawn.y
    })
    test('user should not be able to move across boundary',async()=>{
        ws1.send(JSON.stringify({
            "type":'move',
            payload:{
                x:10000,
                y:10
            }
        }))
        const message1=await waitForAndPopLatestElement(ws1Messages)
        expect(message1.type).toBe('movement-rejected')
        expect(message1.payload.x).toBe(adminX)
        expect(message1.payload.y).toBe(adminY)
    })
    test('if one user leave other get message user-left',async()=>{
        ws2.close()
        const w1=await waitForAndPopLatestElement(ws2Messages)
        expect(w1).toBe('user-left')
        expect(message.payload.userId).toBe(adminId)
    })
})
