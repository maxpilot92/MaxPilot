import Redis from "ioredis";

const redis = new Redis(process.env.REDIS_URI || "redis://localhost:6379");

export default redis;

/*
for particular user, role: id => client: 1 or staff: 1
for all users, role => client or staff
*/