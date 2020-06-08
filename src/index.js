const path				= require('path');
const log				= require('@whi/stdlog')(path.basename( __filename ), {
    level: process.env.LOG_LEVEL || 'fatal',
});

const ip				= require('ip');
const UserAgent				= require('ua-parser-js');
const http_client			= require('@whi/http').client;

function error_check ( response ) {
    if ( response.status || response.error )
	throw new Error(`${response.status} ${response.error}: ${response.message}`);
}

class Collection {

    static async create () {
	const anonymous				= http_client.create( public_vars.API_BASE_URL, {
	    headers: {
		"Content-Type": "application/json",
	    },
	});
	return await anonymous.post("/collections");
    }

    constructor ( collection_id, access_key, bindings ) {
	this.collection_id		= collection_id;
	this.access_key			= access_key;
	this.bindings			= bindings;

	this.api			= http_client.create( public_vars.API_BASE_URL, {
	    headers: {
		"Content-Type": "application/json",
		"Authorization": `Authentic ${access_key}`,
	    },
	});
    }

    async user ( password ) {
	const user			= await this.api.post(`/collections/${this.collection_id}/credentials`, {
	    "password":		password,
	});
	log.debug("POST credentials response: %s", user );
	error_check( user );
	return new User( user );
    }

    async update_password ( credential_id, current_password, password ) {
	const credential		= await this.api.put(`/credentials/${credential_id}`, {
	    current_password,
	    password,
	});
	log.debug("PUT credentials response: %s", credential );
	error_check( credential );
	return new User( credential );
    }

    async session ( credential_id, password, ip_address, user_agent ) {
	const session			= await this.api.post(`/credentials/${credential_id}/sessions`, {
	    password,
	    ip_address,
	    user_agent,
	});
	log.debug("POST sessions response: %s", session );
	error_check( session );
	return new Session( session );
    }

    async validate ( id, ip_address, user_agent ) {
	const session			= await this.api.get(`/sessions/${id}`, {
	    ip_address,
	    user_agent,
	});
	log.debug("GET session response: %s", session );
	error_check( session );
	return new Session( session );
    }
}

class User {
    constructor ( data ) {
	Object.entries( data ).map( ([k,v]) => {
	    this[k]			= v;
	});
    }
}

class Session {
    constructor ( data ) {
	Object.entries( data ).map( ([k,v]) => {
	    this[k]			= v;
	});
    }
}

const compare = {
    userAgents ( request_user_agent, session_user_agent ) {
	const request_ua		= (new UserAgent( request_user_agent )).getResult();
	const session_ua		= (new UserAgent( session_user_agent )).getResult();

	log.debug("Comparing user agents\n    %s\n    %s\n    %20.20s = %s\n    %20.20s = %s\n    %20.20s = %s",
		  request_user_agent,
		  session_user_agent,
		  request_ua.cpu.architecture, session_ua.cpu.architecture,
		  request_ua.os.name, session_ua.os.name,
		  request_ua.browser.name, session_ua.browser.name );
	if ( request_ua.cpu.architecture	!== session_ua.cpu.architecture
	     || request_ua.os.name		!== session_ua.os.name
	     || request_ua.browser.name	!== session_ua.browser.name
	   ) {
	    return false;
	}
	return true;
    },

    ipAddresses ( request_ip_address, session_ip_address ) {
	log.debug("Comparing user IPs\n    %20.20s = %s",
		  request_ip_address, session_ip_address );
	return (ip.isPrivate( session_ip_address ) || ip.isEqual( request_ip_address, session_ip_address ));
    },
};


const public_vars = {
    "API_BASE_URL": "https://vault.magicauth.ca",
    Collection,
    User,
    Session,
    compare
};

module.exports				= public_vars;
