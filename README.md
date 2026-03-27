
# Mural Pay Backend Coding Challenge 

## Plan

- I'm going to deploy the backend from minute 0
  - Why? Because Vercel is fast enough for quick iterations and I don't run into surprises later 
- Since I need to have a database, I'm planning to use prisma and postgres since I'm used to that combo
- I expect to take around 20 min for all of this. Then I'm going read mural documentation and plan the implementation of the challenge
---
The deploy working is in https://muralpay.vercel.app/
Now, I'm going to add a database directly on vercel (neon integration) and setup prisma using https://docs.nestjs.com/recipes/prisma#set-up-prisma

Using vercel env pull, I got my env variables locally 

--- 
I was able to setup prisma on prod under 20 min, now I'm going to reserve another 20 mins for researching and understanding the problem

I understand that we are creating an application, where a
 customer can buy products using USDC and the merchant can withdraw those payments in COP

> I think it is ambiguous whether this is for just one merchant or for multiple merchants in a marketplace, I'm going to start with just one merchant to keep the scope small.

I'm going to pause the timer here because I need access to staging. Current timer 35 min