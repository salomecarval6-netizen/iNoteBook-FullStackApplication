

//Higher-Order Function, which is simply a function that takes another function as an argument and returns a new function.

//The Returned Function ((req, res, next) => { ... }):
const asyncHandler = (request)=>{
  return (req,res,next)=>{
    Promise
      .resolve(request(req,res,next))
      .catch(next)
      //.catch(next) is short-hand syntax for .catch(err => next(err)).
  }
}

export {asyncHandler};


