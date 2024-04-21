const fastify = require("fastify")({ logger: true });
const fs = require("fs");

fastify.get("/", function handler(request, reply) {
  reply.send({ hello: "world" });
});

fastify.get("/log", function handler(request, reply) {
  const params = request.query;
  // console.log(params);
  const t = params.time;

  fs.readFile("time.json", "utf8", (err, data) => {
    if (err) {
      console.error(err);
      reply.code(500).send("Error reading from file");
      return;
    }

    let times = [{ timestamp: t }];

    let fileData = JSON.parse(data);

    console.log({ fileData });

    if (Array.isArray(fileData)) {
      fileData.push({ timestamp: t });
      times = [...fileData];
    }

    // Write the updated array to the file
    fs.writeFile("time.json", JSON.stringify(times), (err) => {
      if (err) {
        console.error(err);
        reply.code(500).send("Error writing to file");
        return;
      }
      // console.log("Times saved to file");
      reply.send(times);
    });
  });

  // reply.send({ timestamp: t });
});

// Run the server!
fastify.listen({ port: 3000 }, (err) => {
  if (err) {
    fastify.log.error(err);
    process.exit(1);
  }
});
