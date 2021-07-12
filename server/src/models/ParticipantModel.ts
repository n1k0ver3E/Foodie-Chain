import { IParticipant } from '../interfaces/participant'
import { Model, model, Schema } from 'mongoose'

const ParticipantSchema: Schema = new Schema(
  {
    accountAddress: {
      type: String,
      required: true,
    },
    accountId: {
      type: Number,
      required: true,
    },
    accountName: {
      type: String,
      required: true,
    },
    accountStatus: {
      type: Number,
      required: true,
    },
    accountType: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
)

const Participant: Model<IParticipant> = model('Participant', ParticipantSchema)

export default Participant
