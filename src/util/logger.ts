import Logger, * as bunyan from "bunyan"
import config from "config"

export const logger: Logger = bunyan.createLogger({
  level: config.get("log.level"),
  name: config.get("app.name"),
  serializers: {
    http: bunyan.stdSerializers.req,
  },
})
