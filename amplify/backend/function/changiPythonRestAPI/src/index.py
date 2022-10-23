import json
import boto3
import os
import mysql.connector

def getDBSecret():
    dbSecret = {}

    try:
        ssm = boto3.client('ssm')
        parameter = ssm.get_parameters(Names=[os.environ.get('rds_database'), os.environ.get('rds_name'), os.environ.get('rds_password'), os.environ.get('rds_port'), os.environ.get('rds_username')], WithDecryption=True)
        print(parameter)
        print(parameter['Parameters'])

        dbSecret['rds_database'] = next((x['Value'] + '_' + os.environ.get('ENV') for x in parameter['Parameters'] if x['Name'].endswith('rds_database')), 'changi')
        dbSecret['rds_name']     = next((x['Value'] for x in parameter['Parameters'] if x['Name'].endswith('rds_name')), '127.0.0.1')
        dbSecret['rds_password'] = next((x['Value'] for x in parameter['Parameters'] if x['Name'].endswith('rds_password')), 'password')
        dbSecret['rds_port']     = next((x['Value'] for x in parameter['Parameters'] if x['Name'].endswith('rds_port')), '3306')
        dbSecret['rds_username'] = next((x['Value'] for x in parameter['Parameters'] if x['Name'].endswith('rds_username')), 'user')
    except:
        dbSecret['rds_database'] = 'changi'
        dbSecret['rds_name']     = '127.0.0.1'
        dbSecret['rds_password'] = 'password'
        dbSecret['rds_port']     = '3306'
        dbSecret['rds_username'] = 'user'

    return dbSecret

def getDBConnection():
    dbSecret = getDBSecret()
    # print(dbSecret)

    cnx = mysql.connector.connect(user=dbSecret['rds_username'], password=dbSecret['rds_password'],
                                    host=dbSecret['rds_name'],
                                    database=dbSecret['rds_database'])

    return cnx

def query(query):
    cnx = getDBConnection()

    cursor = cnx.cursor()
    cursor.execute(query)

    values = []
    for c in cursor:
        print(c)
        values.append(c)

    cursor.close()
    cnx.close()

    return values


def handler(event, context):
    print('received event:')
    print(event)

    if event['path'] == '/python/category' and event['httpMethod'] == 'GET':
        return listCategory()
    else:
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Headers': '*',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'OPTIONS,POST,GET'
            },
            'body': json.dumps('Hello from your new Amplify Python lambda!')
        }

def listCategory():
    result = query('SELECT * FROM Category')

    categoryObj = []
    for (id, name, createdOn, updatedOn, deleted, deletedOn) in result:
        categoryObj.append({
            "id": id,
            "name": name,
            "createdOn": createdOn.isoformat(),
            "updatedOn": updatedOn.isoformat(),
            "deleted": deleted,
            "deletedOn": deletedOn.isoformat() if deletedOn else None
        })

    return {
        'statusCode': 200,
        'body': json.dumps({'categories': categoryObj})
    }