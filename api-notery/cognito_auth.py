
import boto3
import json
import urllib3

def signup_handler(event, context):
    event['response']['autoConfirmUser'] = False
    return event
def delete_user_from_cognito(username, userpool_id):
    client = boto3.client('cognito-idp')
    
    try:
        response = client.admin_delete_user(
            UserPoolId=userpool_id,
            Username=username
        )
        print(f"Usuario {username} eliminado de Cognito")
    except client.exceptions.UserNotFoundException:
        print(f"Usuario {username} no encontrado en Cognito")
    except Exception as e:
        print(f"Error al eliminar el usuario de Cognito: {str(e)}")

def post_signup_handler(event, context):
    print(f"usuario registrado, evento: {event}")
    ses_client = boto3.client('ses')
    # ses_client.send_email(
    #     Source='david.garcia@tbbc.ai',
    #     Destination={'ToAddresses': [event['request']['userAttributes']['email']]},
    #     Message={
    #         'Subject': {'Data': 'Nuevo usuario registrado'},
    #         'Body': {'Text': {'Data': 'Registro exitoso!'}}
    #     }
    # )
    # response = ses_client.send_templated_email(
    #     Source='david.garcia@tbbc.ai',
    #     Destination={'ToAddresses': [event['request']['userAttributes']['email']]},
    # Template='confirmEmail',
    # TemplateData= "{\"nombre\": \"Juan\", \"mensaje\": \"¡Hola, esto es un ejemplo de correo!\"}"
    # )

    
    provider = json.loads(event['request']['userAttributes'].get('identities', '[]'))
    print(provider)
    
    if not provider:
        return event
    
    api_url = "https://z1hm5vrmfi.execute-api.us-east-1.amazonaws.com/dev/notery/users/add"
    headers = {"Content-Type": "application/json"}
    
    payload = {
        'user_name': event['userName'],
        'email': event['request']['userAttributes']['email'],
        'full_name': event['request']['userAttributes'].get('name', f'Usuario de {provider[0]["providerName"]}'),
        'user_password': 'something7Y*',
        "user_role": '509e1b1b-37cf-4be2-9611-41694f6b0e89',
        'account_type': 'private',
        'registration_type': provider[0]['providerName'],
        'status': 'enabled'
    }
    print(f"payload: {payload}")
    http = urllib3.PoolManager()
    try:
        
        response = http.request('POST', api_url, body=json.dumps(payload), headers=headers, retries=False)
        print(f'Respuesta back: {response.data}, {response.status}')
        if response.status == 200:
            print("Solicitud POST exitosa")
        else:
            print("Error en la solicitud POST:", response.status)
            delete_user_from_cognito(event['userName'], event['userPoolId'])
    except urllib3.exceptions.NewConnectionError as e:
        print("Error en la solicitud POST:", str(e))
        delete_user_from_cognito(event['userName'], event['userPoolId'])
    
    return event


