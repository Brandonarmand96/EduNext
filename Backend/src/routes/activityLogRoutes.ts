import express from "express"
import { getAllActivities } from "../controllers/activitiesLogController"
import { authorize, protect } from "../middlewares/auth"


const logsRoutes = express.Router()

logsRoutes.get('/', protect, authorize(['admin']), getAllActivities )

export default logsRoutes