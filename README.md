# Personal Passion Project

[Client](#client) - [Core Project Statement](#core-project-statement) - [Deliverables](#minimum-deliverables) - [Blog](#blog) - [Todo](#todo) - [Schedule](#schedule)

## Client
* Smartphone users who wants to go on a trip and learn more about the city they're in.
* People that want to make the effort to plan a trip.
* People that are open to connect with new people

## Core Project Statement
"What's this monument?".

"I can't find any information on this".

"Stupid tourguide, I can't find it...".

"I don't want to do this trip by myself".

These are some expressions some people have been confronted with.
Then I imagined. What if you had an app to scan monuments, to make your own trips, join someone else's trip or just do the trip of someone else? 

__In the app that I'm about to develop, you can do all of this:__
* Scan landmarks & get information about them
* Plan your own trip
  * A future trip
  * For instant use
* Save & share your trip
* Plan a party
  * For anyone or friends only
* Get a surprise trip
* Save other people's trips
* Comment & rate other people's trip
* Enter challenges & earn trophies

## Minimum Deliverables
* Mobile application working on IOS & Android

## Blog
https://medium.com/personal-passion-project


## Todo
### 1. Authentication
* login / register / logout
* using facebook / twitter / email
* onboarding

### 2. Scanner
* Scan buildings
* take picture of buildings to scan
* picture from library to scan
* get correct information of building

### 3. Trip planner
* read google maps for landmarks
* see map with landmarks to check
  * filter on radius, search landmarks, ...
* add pins
* plan a (future) trip
  * set date + starttime + startlocation
  * set duration, (set budget)
  * check lunch / dinner / drinks / bring your own lunch / just walk
  * solo / party
* Suprise route
  * settings/filter just as you would plan a route
* Save route
* Share route
* Add pictures to your route

### 4. Explore
* nearby monuments
* suggestions / featured trips for this location
* what your friends been up to
* shortcut to tripplanner
* trips you can join
* new challenges

### 5. My trips
* trips you've done
* upcoming trips
* saved trips from comunity
* memories
  * 'last year you did this trip', ...
  
### 6. Challenges
* Challenges at this location
* Common challenges / trophies
  * trophies
    * **Memory-maker:** you took 200 pics during your trips
    * **Hiker**: you took 10.000 steps at one trip
    * **Socializer:** you went on a trip with 5 strangers
    * ...
  * Challenges (during trip / at this city / ... ):
    * **Showoff:** Take 50 pics from your trip
    * **Hiker**: Take 10.000 steps before finishing your trip
    * **Living on the edge**: Go 2km of the route
    * ...
    
### 7. My profile
* basics
* trophies / badges
  * show progress
  * how many you've collected
  * challenges you've completed
* See progress
  * how many trips you've done
  * how many steps you've done
  * ...
  
### 8. Map
* If on a trip
  * see location
  * see your trip / follow your trip
  * progress
    * 5 / 10 km
    * 3425 steps
    * duration: 02:15:21
    * ...
* if not on a trip
  * see location
  * see landmarks
  * search for landmarks / ...
  * filter on radius
  
### 9. Notifications
* Basic notifications
  * someone liked your ...
  * someone saved your ...
  * ...
* See trip on lockscreen

## Schedule
### Sprint 1: 24/11

Working on: [Todo 1](#1-authentication) - [Todo 2](#2-scanner)

* Wireframe + design basics
* Basic setup react native app
  * working on IOS & Android
* Backend integration
* Login / register / logout
* Friend/unfriend someone
* google vision integration
* basic styling

### Sprint 2: 1/12

Working on: [Todo 3](#3-trip-planner) - [Todo 5](#5-my-trips)

* Google maps integration
  * find all relevant landmarks
* Show correct info for monument / building
  * create fallback if monument isn't known or can't scan (using gps location?)
* Create your own trip
  * with all settings
* Create a party
  * can be found by anyone
  * add friends / only be found by friends
* See the trips you've done
* Add someone else's trip to your favourites
* See your upcoming trips
* See your memories


### Sprint 3: 8/12
Working on: [Todo 4](#4-explore) - [Todo 6](#6-challenges) - [Todo 8](#8-map)



### Sprint 4: 15/12
Working on: [Todo 7](#7-my-profile) - [Todo 9](#9-notifications)
