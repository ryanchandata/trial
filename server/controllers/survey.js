let Survey = require('../models/survey');
let userModel = require("../models/user");
let User = userModel.User; // alias
let passport = require("passport");

module.exports.getSurveys = (req, res, next) => {
  const promises = [];

  Survey.find((err, surveys) => {
    if (err) {
      console.error(err);
      res.end(err);
    } else {
      const filteredSurveys = surveys.filter(survey => survey.user);
      // updating returned surveys to include displayName of user
      filteredSurveys.forEach((survey, i) => {
 
        // handle asynchronous function
        const promise = User.findById({"_id": survey.user}, (err, foundUser) => {
          if (err) {
            console.error(err);
          }
         }).exec();

         promises.push(promise);
      })

      Promise.all(promises).then((values) => {
        let surveysToReturn = [];
        filteredSurveys.forEach((survey, index) => {
          surveysToReturn.push({
            ...survey._doc, // destructuring survey object from db
            displayName: values[index].displayName
          });
        })
        
        // sort by id
        surveysToReturn.sort((a, b) => (a._id < b._id) ? 1 : -1);

        res.json({
          error: err,
          data: surveysToReturn
        });
      })

    }
  });
};


module.exports.getSurvey = (req, res, next) => {
  let id = req.params.id
  
  Survey.findById({_id: id}, (err, foundSurvey) => {
    if (err) {
      console.error(err);
      res.end(err);
    } else {
      res.json({
        error: err,
        data: foundSurvey
      });
    }
  });
};


module.exports.addSurvey = (req, res, next) => {
  let newSurvey = Survey({   
      "user":req.body.user,
      "name":req.body.name,
      "dateCreated":req.body.dateCreated,
      "dateActive":req.body.dateActive,
      "dateExpire":req.body.dateExpire,
      "responses":req.body.responses,
      "questions":req.body.questions
  });  

  Survey.create(newSurvey, (err, survey) => {
    if(err)
    {
      console.error(err);
      res.end(err);
    }
    else
    {
      res.json({
        error: err,
        data: survey
      });      
    }
  });
}

module.exports.updateSurvey = (req, res, next) => {
  // the req body has two objects: survey and user
  let id = req.params.id
  let userID = req.body.userID
  let survey = Survey({
    "_id": id,
    "user": req.body.survey.user,
    "name": req.body.survey.name,
    "dateCreated":req.body.survey.dateCreated,
    "dateActive":req.body.survey.dateActive,
    "dateExpire":req.body.survey.dateExpire,
    "responses":req.body.survey.responses,
    "questions":req.body.survey.questions
  })
  
  //prevent users from updating if survey is not theirs
  if (survey.user === userID)
  {
    Survey.updateOne({_id: id}, survey, (err) => {
      if (err) {
        console.error(err);
        res.end(err);
      } else 
      {
        res.json({error: err});
      }
    });
  }
  else
  {
    res.json({error: 'Failed to update messgage'});
  }
}

module.exports.takeSurvey = (req, res, next) => {
  let id = req.params.id
  // bellow stores questions with responses
  let updatedQuestions =  req.body.questions;

  Survey.findById({"_id": id},
   (err, survey) => {
      if (err) {
        console.error(err);
        res.end(err);
      } else 
      {
        // update response count
        survey.responses++;  
        // update options count
        survey.questions.forEach((question, i) => {
          question.options.forEach((option, j) => {
            if (updatedQuestions[i].options[j].count > 0)
            {
              option.count++;
            }
          });
        });
        survey.save();
        
        res.json({
          error: err        
        });
      }
  })
}

module.exports.deleteSurvey = (req, res, next) => {
  let id = req.body.survey._id
  let userID = req.body.userID;
  let surveyUser = req.body.survey.user;
  
  if (surveyUser === userID)
  {
    Survey.remove({_id: id}, (err)=> {
      if (err) 
      {
        console.error(err);
        res.end(err);
      } 
      else
      {
        res.json({
          error: err
        });
      }
    });
  } else
  {
    res.json({error: 'Failed to delete survey'});
  }

}
 