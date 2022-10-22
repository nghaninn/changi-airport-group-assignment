const AWS = require("aws-sdk");
// const AWS = require("/opt/nodejs/node_modules/aws-sdk");

const getSecrets = async (key) => {
    const { Parameters } = await (new AWS.SSM())
        .getParameters({
            Names: [key],
            WithDecryption: true,
        })
        .promise();

    
    console.log(Parameters);
    return Parameters[0] ?? null;
}


module.exports = {
    getSecrets
};
