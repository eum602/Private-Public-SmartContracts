const assert = require("assert")
const {publishData} = require("../index")
const {read1,create} = require("../lib/data")
const {reproduce}=require("../lib/helpers")

const publish = async (count) => {
    let data = await read1('mbox-short')
    data = reproduce(count,data)                
    const result=await publishData(data,count)
    return result
}


describe("Pantheon uploading files", () => {
    test(`Pantheon uploading files - ${5}kB`,async(done)=>{//140KB max tx data for 10M LIMIT_GAS
        const result = await publish(1)
        expect(result.outgoing).toBe(result.incoming)
        done()
    },100000)

    // test(`Pantheon uploading files - ${5*30}kB`,async(done)=>{//1000kB
    //     const result = await publish(30)
    //     expect(result.outgoing).toBe(result.incoming)
    //     done()
    // },50000)

    // test(`Pantheon uploading files - ${5*18}kB`,async(done)=>{//2000kB
    //     const result = await publish(18)
    //     expect(result.outgoing).toBe(result.incoming)
    //     done()
    // },50000)

    // test(`Pantheon uploading files - ${5*19}kB`,async(done)=>{//5000kB
    //     const result = await publish(19)
    //     expect(result.outgoing).toBe(result.incoming)
    //     done()
    // },50000)

    // test(`Pantheon uploading files - ${5*20}kB`,async(done)=>{
    //     const result = await publish(20)
    //     expect(result.outgoing).toBe(result.incoming)
    //     done()
    // },50000)      
})

