/**
 * Groups Users Controller
 * handles every groups users related task and authentication
 */

// importing services
import models from "../models/db";

// let userName = "";
export default {
  addMember(req, res) {
    if (!req.body.userId) {
      res.status(400)
        .send({ error: { message: "userId parameter is required" } });
      return;
    }

    if (!req.params.id) {
      res.status(400)
        .send({ error: { message: "GroupId parameter is required" } });
      return;
    }

    models.GroupsUsers
      .find({
        where: {
          userId: req.body.userId,
          groupId: req.param.id
        }
      })
      .then((response) => {
        if (response) {
          return res.status(400)
            .send({
              error: { message: "user already exist in group" }
            });
        }
        // models.Users
        //   .findOne({
        //     where: { id: req.body.userId }
        //   })
        //   .then((user) => {
        //     userName = user.username;
        //   })
        //   .catch(error => res.status(400).send(error));
        // console.log(`===================> username of current user to be added: ${userName}`);
        // then add username field to group user models and include on param with necessary value
        return models.GroupsUsers
          .create({
            userId: req.body.userId,
            groupId: req.params.id,
            isAdmin: "0"
          })
          .then((result) => {
            res.status(201).send(result);
          })
          .catch((error) => {
            res.status(400).send(error);
          });
      });
  },
  viewMembers(req, res) {
    return models.Groups
      .findAll({
        where: { id: req.params.id },
        include: [{
          model: models.Users,
          through: {
            attributes: ["id", "username"],
          },
          as: "users"
        }]
      })
      .then((members) => {
        // console.log(`members with their user details: ${members}`);
        res.status(200).send(members);
      })
      .catch((error) => {
        res.status(400).send(error);
      });
  },
  viewAllGroupMembers(req, res) {
    return models.GroupsUsers
      .findAll()
      .then(groupMembers => res.status(200).send(groupMembers))
      .catch(error => res.status(400).send(error));
  },
  removeMember(req, res) {
    return models.GroupsUsers
      .destroy({
        where: {
          userId: req.body.usersId,
          groupId: req.params.id
        }
      })
      .then((result) => {
        res.status(202).send(result);
      })
      .catch((error) => {
        res.status(400).send(error);
      });
  }
};
