module Api
  module V1
    class SightingsController < ApplicationController
      respond_to :json

      # GET /api/v1/sightings?service_id=&stop_id=
      # Get last seen information of a service.
      #
      # Return val: an object containing last seen location of a service and
      # the time elapsed since it last left this current stop
      # {
      #   "prev_stops": {
      #     "stop": {
      #       "id": 1,
      #       "name": "PGP Terminal",
      #       "longitude": null,
      #       "latitude": null
      #     },
      #     "last_seen": 2218,
      #     "status": 0     // 0, 1, 2 indicate empty, ok, full
      #   },
      #   "this_stop": 1442290502
      # }
      # Note: Since the default last_seen data is set to '', a query in the initial state might return this
      # {
      #   "prev_stops": {
      #     "stop": "",
      #     "last_seen": "",
      #     "status": ""
      #   },
      #   "this_stop": "No data"
      # }
      def get_sighting
        render json: Sighting.get_sighting(params)
      end

      # POST /api/v1/sightings
      # Post a user report
      #
      # Params:
      # sighting: {
      #   service_id: ...
      #   stop_id: ...
      #   status: ...
      #   time_seen: ...
      #   user_id: ...
      # }
      # :time_seen is an optional params. If there's none, Time.now is used instead
      #
      # Return val:
      # { result: <failed/success> }
      def post_sighting
        render json: Sighting.post_sighting(params[:sighting])
      end
    end
  end
end
