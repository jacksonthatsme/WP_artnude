/*
 * jQuery TicketLeap Upcoming Events Plugin 0.1
 * Copyright (c) 2010 Tim Crowe
 *
 * http://www.ticketleap.com/
 *
 * Dual licensed under the MIT and GPL licenses:
 *   http://www.opensource.org/licenses/mit-license.php
 *   http://www.gnu.org/licenses/gpl.html
*/
(function($){

	$.fn.extend({
		upcomingEvents: function(opts){
			opts = $.extend({}, $.fn.upcomingEvents.defaults, opts);

			return this.each(function(){
				new UpcomingEvents(this, opts);
			});
		}
	});

	var FormattableDate = function(date){
			var d = new Date(date),
				dayMap = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
				monthMap = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"];

			return {
				day: dayMap[d.getDay()],
				month: monthMap[d.getMonth()],
				date: d.getDate(),
				year: d.getFullYear().toString().slice(2),
				hour: (d.getHours() > 12 ? d.getHours() - 12 : (d.getHours() == 0 ? 12 : d.getHours())),
				minute: (d.getMinutes() > 10 ? d.getMinutes() : "0"+d.getMinutes()),
				ampm: (d.getHours() >= 12 ? 'pm' : 'am'),
				toDateString: function(){
					return this.month + "." +
							this.date + "." +
							this.year;
				},
				toTimeString: function(){
					return this.hour + ":" +
							this.minute +
							this.ampm;
				},
				toString: function(){
					return this.toDateString()/* + " " + this.toTimeString()*/;
				}
			};
		},
		
		UpcomingEvents = function(el, opts){

			this.options = opts;
			this.originNode = $(el);

			this.buildShell();
			this.showEventsList();

		}; UpcomingEvents.prototype = {
		
			// base attributes
			options: null,
			originNode: null,
			shell: null,
			events: null,
		
			// header components
			headerLabel: null,
		
			// content area
			content: null,
		
			// navigation buttons
			nextButton: null,
			previousButton: null,
			viewEventsButton: null,
		
			// paging
			currentView: 'events', // performances
			currentEvent: '',
			eventsPage: 1,
			performancesPage: 1,
			totalEvents: 0,
		
			buildShell: function(){
				var self = this,
					html ='<div id="tl-upcoming-content">' +
									'<div class="tl-upcoming-content-list"></div>'+
							'</div>';
			
				this.shell = $(html);
			
				// get header nodes
				this.headerLabel = this.shell.find('.tl-upcoming-header-label');
			
				// get content area node
				this.content = this.shell.find('.tl-upcoming-content-list');
			
				// setup navigation
				this.nextButton = this.shell.find('.tl-upcoming-nav-next .tl-upcoming-button');
				this.previousButton = this.shell.find('.tl-upcoming-nav-previous .tl-upcoming-button');
				this.viewEventsButton = this.shell.find('.tl-upcoming-nav-events .tl-upcoming-button');
			
				this.nextButton.click(function(){ self.page(true); });
				this.previousButton.click(function(){ self.page(false); });
				this.viewEventsButton.click(function(){ self.showEventsList(); });
			
				this.setPageButtonStates();
			
				// place shell nodes
				this.originNode.prepend(this.shell);
			},
		
			capitalize: function(str){
			   return str.charAt(0).toUpperCase() + str.substring(1).toLowerCase();
			},
		
			formatISODateString: function(d){
				function pad(n){ return n<10 ? '0'+n : n; }

				return d.getUTCFullYear()+'-'
				+ pad(d.getUTCMonth()+1)+'-'
				+ pad(d.getUTCDate());
			},

			formatDisplayDates: function(startDate, endDate){
				var s = new FormattableDate(startDate),
					e = new FormattableDate(endDate);
				
				return (s.toDateString() == e.toDateString() ? 
							s.toDateString() /*+ ' ' + s.toTimeString() + ' |u2014 ' + e.toTimeString()*/ :
							s.toString() + ' - ' + e.toString());
			},
			formatDisplayTime: function(startDate, endDate){
				var s = new FormattableDate(startDate),
					e = new FormattableDate(endDate);
				
				return (s.toDateString() == e.toDateString() ? 
							s.toTimeString() + ' \u2014 ' + e.toTimeString() :
							s.toString() + ' - ' + e.toString());
			},

			page: function(forward){
				this[this.currentView + 'Page'] += (forward ? 1 : -1);
				if(this.currentView == 'events'){
					this.events = null;
				} else if( this.currentView == 'performances'){
					this.events[this.currentEvent].performances = null;
				}
				this['show' + this.capitalize(this.currentView) + 'List'](this.currentEvent);
			},

			setPageButtonStates: function(){
				this.previousButton[this.isFirstPage() ? 'hide' : 'show']();
				this.nextButton[this.isLastPage() ? 'hide' : 'show']();
			},

			isFirstPage: function(){
				return (this.currentView == 'events' && this.eventsPage == 1) || 
						(this.currentView == 'performances' && this.performancesPage == 1);
			},
		
			isLastPage: function(){
				return (this.currentView == 'events' && ((this.options.pageSize > this.totalEvents) || (this.eventsPage*this.options.pageSize >= this.totalEvents))) ||
						(this.currentView == 'performances' && ((this.options.pageSize > this.events[this.currentEvent].performance_count) || 
																(this.performancesPage*this.options.pageSize >= this.events[this.currentEvent].performance_count)));
			},

			clearContent: function(){
				this.content.empty();
			},

			createButton: function(content, additionalClass, clickFunction){
				var button = $('<div class="tl-upcoming-item-control"><span class="tl-upcoming-button '+ additionalClass +'">'+ content +'</span></div>');
				button.click(clickFunction);
				return button;
			},

			markFirstAndLast: function(){
				$(this.content.find('tr').get(0)).addClass('tl-upcoming-item-first');
				$(this.content.find('tr').get(-1)).addClass('tl-upcoming-item-last');
			},

			getObjects: function(eventSlug){
				var url = this.options.apiUrl + "organizations/" + this.options.orgSlug + "/events" + (typeof eventSlug == 'string' ? '/' + eventSlug : '') + "?key=" + this.options.apiKey + "&callback=?",
					pageNum = (typeof eventSlug == 'string' ? this.performancesPage : this.eventsPage);
				
				return $.ajax({
					url: url,
					data: {
						page_num: pageNum,
						page_size: this.options.pageSize,
						dates_after: this.formatISODateString(new Date)
					},
					dataType: 'jsonp'
				});
			},

			showEventsList: function(){
				var self = this;
			
				this.currentView = 'events';
				this.currentEvent = '';
				this.performancesPage = 1;
				this.headerLabel.html('Upcoming Events');
				this.viewEventsButton.hide();
			
				if(this.events){
					this.clearContent();
					$.each(this.events, function(i, eventObj){
						self.content.append(self.createEvent(eventObj));
					});
					this.setPageButtonStates();
				} else {
					this.getEventsList();
				}
				this.markFirstAndLast();
			},

			getEventsList: function(){
				var self = this;
			
				this.events = {};

				$.when(this.getObjects()).then(function(data){
					$.each(data.events, function(idx, eventObj){
						self.events[eventObj.slug] = eventObj;
					});
					self.totalEvents = data.total_count;
					self.showEventsList();
				});
			},

			createEvent: function(eventObj){
				var self = this,
					eventEl = $('<div class="tl-upcoming-item">' +
									'<div class="tl-upcoming-item-label tl-upcoming-event-label">' +
									 '<div class="tl-upcoming-event-dates">' + this.formatDisplayDates(eventObj.earliest_start_local, eventObj.latest_end_local) + '</div>' +
										'<div class="tl-upcoming-event-title">' + eventObj.name +'</div>' +
									'</div>' +
									'<div class="dropdown"></div>' +
								'</div>' 
								),
					eventDr = $('<div class="dropdown-container">' +
									'<div class="event-info">' + 
										'<div class="time">' +
											this.formatDisplayTime(eventObj.earliest_start_local, eventObj.latest_end_local) +
										'</div>' +
										'<div class="venue">' +
											eventObj.venue_name +
										'</div>' +
										'<div class="location">' +
											eventObj.venue_street + ', ' +
											eventObj.venue_city + ' ' +
											eventObj.venue_region_name + ', ' +
											eventObj.venue_postal_code +
										'</div>' +
									'</div>' +
									eventObj.html_description + 
								'</div>'
							);

				if(eventObj.performance_count == 1){
					eventEl.append(this.createButton('Buy Tickets', 'tl-upcoming-button-buy', function(){
						window.open(eventObj.url);
					}));
				} else if(eventObj.performance_count > 1){
					eventEl.append(this.createButton('Dates &raquo;', 'tl-upcoming-button-info', function(){
						self.showPerformancesList(eventObj.slug);
					}));
				}
				
/*ACCORDION FUNCTIONALITY -- Adopted gracefully from http://www.stemkoski.com/stupid-simple-jquery-accordion-menu/ */

	 
				//ACCORDION BUTTON ACTION (ON CLICK DO THE FOLLOWING)
				var eventHead = eventEl;
				var moreContent = eventDr;
				moreContent.hide();
				eventHead.click(function() {
			
					//REMOVE THE ON CLASS FROM ALL BUTTONS
					eventHead.removeClass('on');
					  
					//NO MATTER WHAT WE CLOSE ALL OPEN SLIDES
				 	moreContent.slideUp('slow');
			   
					//IF THE NEXT SLIDE WASN'T OPEN THEN OPEN IT
					if($(this).next().is(':hidden') == true) {
						
						//ADD THE ON CLASS TO THE BUTTON
						$(this).addClass('on');
						  
						//OPEN THE SLIDE
						$(this).next().slideDown('normal');
					 } 
					 				
				//ADDS THE .OVER CLASS FROM THE STYLESHEET ON MOUSEOVER 
				eventHead.mouseover(function() {
					$(this).addClass('over');
					
				//ON MOUSEOUT REMOVE THE OVER CLASS
				}).mouseout(function() {
					$(this).removeClass('over');										
				});
				
			
			});
				
				return [eventEl, eventDr];
			},

			showPerformancesList: function(eventSlug){
				var self = this;
			
				this.currentView = 'performances';
				this.currentEvent = eventSlug;
				this.headerLabel.html(this.events[eventSlug].name);
				this.viewEventsButton.show();
			
				if(this.events[eventSlug].performances){
					this.clearContent();
					$.each(this.events[eventSlug].performances, function(idx, performanceObj){
						self.content.append(self.createPerformance(performanceObj));
					});
					this.setPageButtonStates();
				} else {
					this.getPerformancesList(eventSlug);
				}
				this.markFirstAndLast();
			},
		
			getPerformancesList: function(eventSlug){
				var self = this;
				this.events[eventSlug].performances = {};

				$.when(this.getObjects(eventSlug)).then(function(data){
					$.each(data.performances, function(i, performanceObj){
						self.events[eventSlug].performances[performanceObj.slug] = performanceObj;
					});
					self.showPerformancesList(eventSlug);
				});
			},

			createPerformance: function(performanceObj){
				var self = this,
					perfEl = $('<div class="tl-upcoming-item tl-upcoming-performance">' +
									'<div class="tl-upcoming-item-label">' +
										'<div class="tl-upcoming-performance-label">' + this.formatDisplayDates(performanceObj.start_local, performanceObj.end_local) + '</div>' +
									'</div>' +
								'</div>');
			
				perfEl.append(this.createButton('Buy Tickets', 'tl-upcoming-button-buy', function(){
					window.open(performanceObj.url);
				}));
				
				return perfEl;
			}
		};

	// default options
	$.fn.upcomingEvents.defaults = {
		pageSize: 5,
		apiUrl: "http://public-api.ticketleap.com/"
	};

	$(document).ready(function() {	
		
	});

})(jQuery);