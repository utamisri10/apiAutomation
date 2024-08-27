import chai from 'chai'
import { expect } from 'chai'
import chaiJsonSchema from 'chai-json-schema'
import {
    getListUsers, postCreateNewUser, login, getSingleUser,
    getListResources, getSingleResource, updateDataUser,
    registerUser, getDelayResponse} from '../apis/reqres.api.js';
import { dataUser, dataLogin } from '../data/reqres.data.js'

chai.use(chaiJsonSchema)

describe("Reqres demo project", function () {
    it("User successful get list", async function () {
        const res = await getListUsers({
            page:2
        });
        expect(res).to.have.status(200);
        
        const listDataUser = res.data.data;
        let lastName = null;

        for (let i = 0; i < listDataUser.length; i++) {
            if (listDataUser[i].last_name === 'Lawson') {
                lastName = listDataUser[i];
                break;
            }
        }
            if (lastName === null){
                throw new Error ("Data is not available")
            }
        expect(lastName).to.have.property('last_name', 'Lawson');

    });

    it("Create new user", async function() {
        const res = await postCreateNewUser ({
            data: dataUser,
        })
        expect(res).to.have.status(201);
    })

    it("User do login but missing password", async function() {
        const res = await login ({
            data: dataLogin
        })
        expect(res).to.have.status(400)
        expect(res.data).to.have.property('error', 'Missing password')
    })

    it("User do login successfully", async function() {
        const res = await login ({
            data:{
                ... dataLogin,
                password: 'cityslicka',
            } 
            
        })
        expect(res).to.have.status(200)
        expect(res.data.token).is.not.empty
    })

    it("Get single user", async function(){
        const res = await getSingleUser ({
            userID: 2
        })
        expect(res).to.have.status(200)
        expect(res.data.data.last_name).to.have.equal('Weaver')
    })

    it("Get list resource", async function (){
        const res = await getListResources ({
            page: 1,
        })
        expect(res).to.have.status(200)

        const dataResources = res.data.data;
        let idResource = null;

        for (let i = 0; i < dataResources.length; i++) {
           if (dataResources[i].id === 6) {
            idResource = dataResources[i];
            break;
           }
        }
            if (idResource === null) {
                throw new Error ("id not found in resources")
            }
        expect(idResource).to.have.property('id', 6);
    })

    it("Get single resource", async function(){
        const res = await getSingleResource({
            id: 2
        })
        expect(res).to.have.status(200)
        expect(res.data.data.id).to.equal(2)
    })

    it("Update data user", async function() {
        const res = await updateDataUser ({
            data: {
                ...dataUser,
                grade: 'Junior 1'
            },
            id: 2,
            method: 'put',
        })
        expect(res).to.have.status(200)
        expect(res.data.updatedAt).is.not.empty
        
    })

    it("Pastial update for data users", async function(){
        const res = await updateDataUser ({
            data: dataUser,
            id: 2,
            method: 'patch',
        })
        expect(res).to.have.status(200)
        console.log(res.request.url)
        console.log(res.request.method)
    })

    it("Delete data user", async function (){
        const res = await updateDataUser ({
            id: 2,
            method: 'delete',
        })
        expect(res).to.have.status(204)
        console.log(res.request.method)
    })

    it("do register user", async function () {
        const res = await registerUser ({
            data: {
                ...dataLogin,
                password: 'pistol'
            }
        })
        expect(res).to.have.status(200)
    })

    it("do register user with invalid username", async function () {
        const res = await registerUser ({
            data: {
                email: '123@reqres.in',
                password: 'pistol'
            }
        })
        expect(res).to.have.status(400)
        expect(res.data).to.haveOwnProperty('error', 'Note: Only defined users succeed registration')
    })

    it("Check delay api for 5ms", async function () {
        this.timeout(10000)
        const startTime = Date.now()
        const res = await getDelayResponse ({
            delayTime: 5
        })
        expect(res).to.have.status(200)

        const endTime = Date.now()
        const duration = endTime - startTime
        expect(duration).to.be.greaterThan(5000)
    })
})