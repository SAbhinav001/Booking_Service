const amqplib = require("amqplib");
const {MESSAGE_BROKER_URL, EXCHANGE_NAME} = require("../config/server-config")

const createChannel = async () => {
  try {
    //  first create channel
   
    const connection = await amqplib.connect('amqp://127.0.0.1');
    // the message broker contain multiple queues
    


    const channel = await connection.createChannel()

    //assertexchange used to distribute the message amaong varioud queues
    //also it uses bindingKey to indentigy whuch queue to semd the message
    //exchangebname is the distributor name
    await channel.assertExchange(EXCHANGE_NAME, "direct", false);

    return channel;
  } catch (error) {
    throw error;
  }
};


const subscribeMessage =async (channel, service , binding_Key)=>{
    const applicationQueue=  await channel.assertQueue('REMINDER_QUEUE')
    channel.bindQueue(applicationQueue.queue, EXCHANGE_NAME, binding_Key)

    channel.consume(applicationQueue.queue, msg=>{
        console.log("received data")
        console.log(msg.content.toString())
        channel.ack(msg)
    })

}

const publishMessage =async (channel, binding_Key, message)=>{
   
    try{
        await channel.assertQueue('REMINDER_QUEUE')
        await channel.publish(EXCHANGE_NAME, binding_Key, Buffer.from(message))
    }
    catch(error){
        throw error
    }

}

module.exports={
    createChannel,
    subscribeMessage,
    publishMessage
}