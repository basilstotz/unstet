declare name 		"unstet";
declare version 	"1.0";
declare author 		"basilstotz";
declare license 	"BSD";
declare copyright 	"amXa";

declare options 	"[osc:on]";

import("stdfaust.lib");

import("m11_waveform.dsp");
import("m12_waveform.dsp");
import("m13_waveform.dsp");
import("m21_waveform.dsp");
import("m22_waveform.dsp");
import("m23_waveform.dsp");
import("m31_waveform.dsp");
import("m32_waveform.dsp");
import("m33_waveform.dsp");
import("m41_waveform.dsp");
import("m42_waveform.dsp");
import("m43_waveform.dsp");


//m11_0 = waveform{};
//m11 = (m11_0):((!,_));
//m11_rtable_0(r) = (m11_0,r):rdtable;

play_wave(gate,wave) = ba.countup(m_count,m_gate(gate)):m_table
		   with {
		   	m_count=(wave):((_,!));
			m_table(r)=(wave,r):rdtable;
			m_gate(gate)=button("%gate"):ba.impulsify;
			};

beamer(n)=hgroup("beamer%n",
	  play_wave(11,m11_0),
	  play_wave(12,m12_0),
	  play_wave(13,m13_0),
	  play_wave(21,m21_0),
	  play_wave(22,m22_0),
	  play_wave(23,m23_0),
	  play_wave(31,m31_0),
	  play_wave(32,m32_0),
	  play_wave(33,m33_0),
	  play_wave(41,m41_0),
	  play_wave(42,m42_0),
	  play_wave(43,m43_0):>_);

process = par(i,4,beamer(i+1));
