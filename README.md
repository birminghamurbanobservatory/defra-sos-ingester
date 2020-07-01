# defra-sos-ingester

Pulls in Defra data from its Sensor Observations Service (SOS). Intended to be run as a CronJob.


## Timeseries IDs

Getting the timeseries can be a bit of a manual process. For a given variable you can get a list of the stations that measure it and the associated ID. 

For example here is the request for [Nitrogen Monoxide](https://uk-air.defra.gov.uk/sos-ukair/api/v1/stations?expanded=true&phenomenon=38).

N.B. there can be more than one timeseries listed per station, although generally only one is active.


## Documentation

Comment from the company Ricardo on how the sample is perform:

> These will be the average over the preceding hour, the frequency of the spot readings and how analysers work these up to the averaging periods will vary from make to make, but there is a residence time for the gas to be detected, so around 1 minute detection for a typical ambient gas analyser.  Similar for particulate and particulate speciation (which will have the longest detection dwell time of about 15 minutes, but it is sampling air all through that time onto a rotating denuder). Fastest analyser I’ve used is 20Hz point measurements but nothing like that is currently out in the AURN.

- [EU Standard Methods for monitoring and UK Approach](https://uk-air.defra.gov.uk/networks/monitoring-methods?view=eu-standards)

- [AURN](https://uk-air.defra.gov.uk/networks/network-info?view=aurn)

- UK Air's [Station Map](https://uk-air.defra.gov.uk/interactive-map)

- [List of variables](http://dd.eionet.europa.eu/vocabulary/aq/pollutant/view)

- [SOS Documentation](https://uk-air.defra.gov.uk/data/about_sos)

- Last reading from [Birmingham A4540 Roadside](https://uk-air.defra.gov.uk/data/site-data?f_site_id=BIRR&view=last_hour)

- [Birmingham A4540 Site Info](https://uk-air.defra.gov.uk/networks/site-info?site_id=BIRR)

- Last reading from [Birmingham Ladywood](https://uk-air.defra.gov.uk/data/site-data?f_site_id=BMLD&view=last_hour)

- [Birmingham Ladywood Site Info](https://uk-air.defra.gov.uk/networks/site-info?site_id=BMLD)

- Last reading from [Birmingham Acocks Green](https://uk-air.defra.gov.uk/data/site-data?f_site_id=AGRN&view=last_hour)

- [Acocks Green Site Info](https://uk-air.defra.gov.uk/networks/site-info?site_id=AGRN)

