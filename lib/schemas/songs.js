/*Songs.attachSchema(new SimpleSchema({
  sl: {
    type: String,
    label: "song link",
    index: true,
    unique: true
  },
  dataSource: {
    type: String,
    label: "source from where link was originally shared"
  },
  type: {
    type: String,
    label: "type of link - YouTube or SoundCloud"
  },
  sa: {
    type: String,
    label: "song artist"
  },
  st: {
    type: String,
    label: "song title"
  },
  album: {
    type: String,
    label: "off which album",
    optional: true
  },
  releaseDate: {
    type: String,
    label: "album released when",
    optional: true
  },
  genre: {
    type: String,
    label: "song genre",
    optional: true
  }, 
  trackNumber: {
    type: String,
    label: "track number if iTunes data exists for this song",
    optional: true
  }, 
  trackCount: {
    type: String,
    label: "total track count on album if iTunes data exists for this song",
    optional: true
  }, 
  discCount: {
    type: String,
    label: "total number of dics for this album if iTunes data exists for this song",
    optional: true
  }, 
  discNumber: {
    type: String,
    label: "disc number for this song if iTunes data exists",
    optional: true
  }, 
  sharedBy: {
    type: [Object],
    label: "this link was shared by all these people"
  },
  iTunesLargeAlbumArt: {
    type: String,
    label: "large album art from iTunes",
    optional: true
  },
  iTunesMediumAlbumArt: {
    type: String,
    label: "medium album art from iTunes",
    optional: true
  },
  iTunesTrackPrice: {
    type: String,
    label: "price of this track on iTunes",
    optional: true
  },
  iTunesAlbumPrice: {
    type: String,
    label: "price of this album on iTunes",
    optional: true
  },
  iTunesPriceCurrency: {
    type: String,
    label: "currency used for price",
    optional: true
  },
  iTunesTrackURL: {
    type: String,
    label: "URL to buy this song from iTunes",
    optional: true
  },
  iTunesAlbumURL: {
    type: String,
    label: "URL to buy this album from iTunes",
    optional: true
  },
  trackExplicitness: {
    type: String,
    label: "explicitness info about this song",
    optional: true
  },
  albumExplictness: {
    type: String,
    label: "explicitness info about this album",
    optional: true
  },
  trackDuration: {
    type: String,
    label: "duration for this song",
    optional: true
  },
  LFMLargeAlbumArt: {
    type: String,
    label: "large album art from LastFM",
    optional: true
  },
  LFMMediumAlbumArt:  {
    type: String,
    label: "medium album art from LastFM",
    optional: true
  },
  songSearchText: {
    type: String,
    label: "text used for searching for details about this song",
    optional: true
  },
  iTunesValid: {
    type: String,
    allowedValues: ['PENDING', 'VALID'],
    label: "PENDING OR VALID - based on iTunes API is this a valid song or not",
    optional: true
  },
  LFMValid: {
    type: String,
    allowedValues: ['PENDING', 'VALID'],
    label: "PENDING OR VALID - based on LastFM API is this a valid song or not",
    optional: true
  },
  listenCount: {
    type: String,
    label: "listen count"
  },
  aeCount: {
    type: String,
    label: "auto error count"
  },
  meCount: {
    type: String,
    label: "manual error count"
  },
  wuzzyFactor: {
    type: String,
    label: "wuzzy factor when matched iTunes data was got",
    optional: true
  },
  cleanedTrackSearchQuery: {
    type: String,
    label: "cleaned track details used for searching in APIs",
    optional: true
  },
  createdAt: {
    type: Date,
      autoValue: function() {
        if (this.isInsert) {
          return new Date();
        } else if (this.isUpsert) {
          return {$setOnInsert: new Date()};
        } else {
          this.unset();
        }
      }
  },
  updatedAt: {
    type: Date,
    autoValue: function() {
      if (this.isUpdate) {
        return new Date();
      }
    },
    denyInsert: true,
    optional: true
  }
}));*/