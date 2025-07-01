import z, { object } from 'zod'

export const SignUpSchema=z.object({
    username:z.string(),
    password:z.string(),
    type:z.enum(['User','Admin'])
})


export const SignInSchema=z.object({
    username:z.string(),
    password:z.string(),
})

export const UpdateMetaData=z.object({
    avatarId:z.string()
})

export const CreateSpace=z.object({
    name:z.string(),
    dimension:z.string().regex(/^[1-9]{2,3}}x[1-9]{2,3}^/),
    mapId:z.string()
})
export const AddElement=z.object({
    elementId:z.string(),
    spaceId:z.string(),
    x:z.number()
})
export const CreateElement=z.object({
    imageUrl:z.string(),
    width:z.number(),
    height:z.number(),
    static:z.boolean()
})
export const UpdateElement=z.object({
    imageUrl:z.string()
})
export const CreateAvatar=z.object({
    imageUrl:z.string(),
    name:z.string()
})
export const CreateMap=z.object({
    thumbnail:z.string(),
    dimension:z.string().regex(/^[1-9]{2,3}}x[1-9]{2,3}^/),
    name:z.string(),
    defaultElements:z.array(object({
        elementId:z.string(),
        x:z.number(),
        y:z.number()
    }))
})