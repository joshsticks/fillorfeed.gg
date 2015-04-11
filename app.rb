require 'sinatra'

get '/' do
  ENV["LOL_API_KEY"][0..2]
end