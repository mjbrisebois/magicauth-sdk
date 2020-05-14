const path				= require('path');
const log				= require('@whi/stdlog')(path.basename( __filename ), {
    level: process.env.LOG_LEVEL || 'fatal',
});

const http_client			= require('@whi/http').client;


class Collection {
    constructor ( collection_id, access_key, bindings ) {
	this.collection_id		= collection_id;
	this.access_key			= access_key;
	this.bindings			= bindings;

	this.api			= http_client.create(`http://localhost:2884`, {
	    headers: {
		"Content-Type": "application/json",
		"Authorization": `Authentic ${access_key}`,
	    },
	});
    }

    async user ( password ) {
	const user			= await this.api.post("/credentials", {
	    "collection_id":	this.collection_id,
	    "password":		password,
	});
	return new User( user );
    }

    async session ( credential_id, password, ip_address, user_agent ) {
	const session			= await this.api.post(`/sessions`, {
	    credential_id,
	    password,
	    ip_address,
	    user_agent,
	});
	return new Session( session );
    }

    async validate ( id, ip_address, user_agent ) {
	const session			= await this.api.get(`/sessions/${id}`, {
	    ip_address,
	    user_agent,
	});
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


module.exports				= {
    Collection,
    User,
};
